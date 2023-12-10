package calebxzhou.liberator.ssm

import calebxzhou.liberator.*
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.StringWriter

/**
 * Created  on 2023-12-05,15:55.
 */


const val JAVA_OUT_PATH = "src/main/java"
const val SSM_OUT_PATH = "$JAVA_OUT_PATH/com/ssm"
const val WEB_OUT_PATH = "src/main/webapp"
const val WEB_INF_OUT_PATH = "$WEB_OUT_PATH/WEB-INF"



val logger = KotlinLogging.logger{}
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
    private val entityMap: LinkedHashMap<String,Entity> = linkedMapOf(),
    private val actorMap: LinkedHashMap<String,Actor> = linkedMapOf(),
)  {

    val entities = entityMap.values
    val actors = actorMap.values
    //添加实体
    operator fun plusAssign(entity: Entity){
        entityMap += entity.id to entity
    }
    operator fun plusAssign(actor: Actor){
        actorMap += actor.id to actor
    }
    operator fun get(entityId: String) : Entity? = entityMap[entityId]
    //生成全部实体的代码（实体id to 代码）
    fun genCodeForEntities():Map<Entity,List<CodeGen>>{
        val map = hashMapOf<Entity,List<CodeGen>>()
        for (entity in entities) {
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
        //从dsl代码创建项目
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
            for (entityLine in dsl.splitByReturn()) {
                val fieldTokens = entityLine.splitBySpace().toMutableList()
                //每行第一个token是实体
                val entity = IdNameBase.fromToken(fieldTokens.removeFirst()).run {
                    Entity(id,name)
                }
                logger.info { "处理实体 ${entity.name}${entity.id}" }
                //先给实体加上主键（xxx id，xxx编号）
                entity += Field("${entity.id}Id","${entity.name}编号",entity.id)
                //再添加其他字段
                for (fieldToken in fieldTokens) {
                    entity += IdNameBase.fromToken(fieldToken).run {

                        Field(id,name,entity.id).let {field ->
                            //如果字段name是已经存在的实体name，设定关联
                            val refEntity = project.entities.find { it.name == field.name }
                            if(refEntity != null){
                                field.id = entity.id +"_"+refEntity.primaryKey.id
                                entity.fieldRefMap += field to refEntity
                                field.type = Field.ID_JTYPE
                            }
                            field
                        }

                    }
                }
                //若没有其他字段，加上"xxx名称"字段
                if(fieldTokens.isEmpty()){
                    entity += Field("${entity.id}Name",entity.name+"名称",entity.id)
                }
                project += entity
            }
        }
        private fun optimizeEntities(project: SsmProject){
            //为全项目加上系统角色和系统用户实体
            project += Entity("role", "角色").apply {
                this += Field("roid", "角色编号","role")
                this += Field("roname", "角色名称","role")
            }
            project += Entity("systemuser","用户").apply {
                this += Field("pwd", "密码","systemuser")
                this += Field("role", "角色","systemuser")
            }/*
            //字段是实体，更改类型并设定关联
            project.entities.forEach { entity ->
                entity.classFields.forEach { field ->
                    val refEntity = project[field.id]
                    if(refEntity!=null){
                        entity.fieldRefMap += field to refEntity
                        logger.info { "${entity.id} 的${field.id} 关联 ${refEntity.id}" }
                    }
                }
            }*/
        }
        private fun handlePermDsl(project: SsmProject, dsl:String): List<Actor>{
            val permLines = dsl.splitByReturn()
            val actors = arrayListOf<Actor>()
            var actorNow:Actor?=null
            for ((i, permLine) in permLines.withIndex()) {
                //创建新的角色
                if(permLine.extractEnglish()!=null){
                    actorNow = IdNameBase.fromToken(permLine).run {
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
                        project.entityMap.forEach { (_, entity) ->
                            handleActorPerms(permissionStr,entity,actorNow)
                        }
                    }
                    //处理单个实体权限
                    else{
                        val entity = project.entityMap.values.find { it.name==entityName }
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
