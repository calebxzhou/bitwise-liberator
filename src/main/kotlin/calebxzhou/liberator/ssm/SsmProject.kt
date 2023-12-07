package calebxzhou.liberator.ssm

import calebxzhou.liberator.*
import java.io.StringWriter

/**
 * Created  on 2023-12-05,15:55.
 */
enum class Permission{
    SELECT,UPDATE,INSERT,DELETE
}

const val JAVA_OUT_PATH = "src/main/java"
const val SSM_OUT_PATH = "$JAVA_OUT_PATH/com/ssm"
const val WEB_OUT_PATH = "src/main/webapp"
const val WEB_INF_OUT_PATH = "$WEB_OUT_PATH/WEB-INF"




data class EntityPermission(
    val entityId: String,
    val perms: MutableSet<Permission> = hashSetOf()
)

data class Actor(
    override val id: String,
    override val name: String,
    val perms: MutableList<EntityPermission> = arrayListOf()
) : IdNameBase(id, name)

data class CodeGen(
    val codeType: CodeType,
    val code:String,
)

data class SsmProject(
    val pjName:String,
    val entities: LinkedHashMap<String,Entity> = linkedMapOf(),
    val actors: LinkedHashMap<String,Actor> = linkedMapOf(),
):NameIdStorable{

    override val nameToId = hashMapOf<String,String>()
    //添加实体
    operator fun plusAssign(entity: Entity){
        entities += entity.id to entity
        nameToId += entity.name to entity.id
    }
    operator fun plusAssign(actor: Actor){
        actors += actor.id to actor
        nameToId += actor.name to actor.id
    }
    //生成全部实体的代码（实体id to 代码）
    fun genCodeForEntities():Map<Entity,List<CodeGen>>{
        val map = hashMapOf<Entity,List<CodeGen>>()
        for ((id,entity) in entities) {
            val code = arrayListOf<CodeGen>()
            CodeType.entries.filter { !it.forGlobal }
                .forEach { codeType ->
                    StringWriter().use { out->
                        templateOf(codeType.templatePath)
                            .process(mapOf("entity" to entity,"project" to this),out)
                        code += CodeGen(codeType,out.toString())
                    }
            }
            map += entity to code
        }
        return map
    }
    //生成整个项目的代码
    fun genCodeForProject():Map<CodeType,CodeGen>{
        val map = hashMapOf<CodeType,CodeGen>()
        CodeType.entries.filter { it.forGlobal }
            .forEach { codeType ->
                StringWriter().use { out->
                    templateOf(codeType.templatePath)
                        .process(mapOf("project" to this),out)
                    map += codeType to CodeGen(codeType,out.toString())
                }
            }
        return map
    }

    companion object{
        fun fromDsl(pjName:String?, entityDsl:String?, permDsl:String?):SsmProject{
            if(pjName.isNullOrBlank() || entityDsl.isNullOrBlank() || permDsl.isNullOrBlank())
                throw SsmException("输入不能为空")
            //项目
            val project = SsmProject(pjName)
            initEntitiesFromDsl(project,entityDsl)
            optimizeEntities(project)
            handlePermDsl(project, permDsl)
            return project
        }
        private fun initEntitiesFromDsl(project: SsmProject, dsl:String){
            val entityLines = dsl.splitByReturn()
            for (entityLine in entityLines) {
                val fieldTokens = entityLine.splitBySpace().toMutableList()
                //每行第一个token是实体
                val entity = IdNameBase.fromToken(project,fieldTokens.removeFirst()).run {
                    Entity(id,name)
                }
                for (fieldToken in fieldTokens) {
                    entity += IdNameBase.fromToken(project,fieldToken).run {
                        Field(id,name,entity.id)
                    }
                }
                project += entity
            }
        }
        private fun optimizeEntities(project: SsmProject){
            //为全项目加上系统角色和系统用户实体
            project += Entity("role", "角色")
            project += Entity("systemuser","用户").apply {
                this += Field("id", "用户名" ,"systemuser")
                this += Field("pwd", "密码","systemuser")
                this += Field("role", "角色","systemuser")
            }
            project.entities.values.forEach { entity ->
                //实体0属性，自动加上id name属性（xx编号，xx名称）
                if(entity.fields.isEmpty()){
                    entity += Field("id",entity.name+"编号",entity.id)
                    entity += Field("name",entity.name+"名称",entity.id)
                }
                //默认第一个字段是主键
                entity.fields.values.first().isPrimaryKey=true

            }
            //字段是实体，更改类型并设定关联
            project.entities.forEach { (_, entity) ->
                entity.fields.forEach { (_, field) ->
                    project.entities[field.id]?.let { matchedEntity ->
                        val firstFieldId = matchedEntity.fields.entries.firstOrNull()?.key
                        if (firstFieldId != null) {
                            field.ref = FieldRef(matchedEntity.id, firstFieldId)
                        }
                    }
                }
            }
        }
        private fun handlePermDsl(project: SsmProject, dsl:String): List<Actor>{
            val permLines = dsl.splitByReturn()
            val actors = arrayListOf<Actor>()
            var actorNow:Actor?=null
            for ((i, permLine) in permLines.withIndex()) {
                //创建新的角色
                if(permLine.extractEnglish()!=null){
                    actorNow = IdNameBase.fromToken(project,permLine).run {
                        Actor(id,name)
                    }
                    continue
                }
                //处理当前角色
                if(actorNow !=null){
                    val permTokens = permLine.splitBySpace()
                    val entityName = permTokens[0]
                    val permissionStr = permTokens[1]
                    //处理全部实体权限
                    if(entityName == "全部"){
                        project.entities.forEach { (_, entity) ->
                            handleActorPerms(permissionStr,entity,actorNow)
                        }
                    }
                    //处理单个实体权限
                    else{
                        val entity = project.entities.values.find { it.name==entityName }
                            ?:throw SsmException("无效的权限设定！找不到实体“$entityName”")
                        handleActorPerms(permissionStr,entity,actorNow)
                    }

                }
                //下一个是新的角色 就保存当前角色
                if((permLines.getOrNull(i + 1)?.extractEnglish()) != null){
                    if(actorNow !=null){
                        actors += actorNow
                    }
                }

            }
            return actors
        }
        private fun handleActorPerms(perm:String,entity: Entity,actorNow: Actor){
            val entityPermission = EntityPermission(entity.id)
            when {
                perm.contains("增") -> entityPermission.perms += Permission.INSERT
                perm.contains("删") -> entityPermission.perms += Permission.DELETE
                perm.contains("改") -> entityPermission.perms += Permission.UPDATE
                perm.contains("查") -> entityPermission.perms += Permission.SELECT
            }
            actorNow.perms += entityPermission
        }
    }
}
class SsmException(reason:String) :Exception(reason){

}
