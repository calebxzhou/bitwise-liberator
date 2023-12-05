package calebxzhou.liberator.ssm

import calebxzhou.FREEMARKER_CONF
import calebxzhou.liberator.*
import java.io.StringWriter

/**
 * Created  on 2023-12-05,15:55.
 */
enum class Permission{
    SELECT,UPDATE,INSERT,DELETE
}
open class Base(
    open val id: String,
    open val name: String
) {
    val capId
    get() = id.capitalize()
    val uncapId
    get() = id.decapitalize()
}

data class Field(
    override val id: String,
    override val name: String,
) : Base(id, name){
    var type = "String"
}

data class Entity(
    override val id: String,
    override val name: String,
    val fields: MutableList<Field>
) : Base(id, name)

data class EntityPermission(
    val entityId: String,
    val perms: MutableSet<Permission> = hashSetOf()
)

data class Actor(
    override val id: String,
    override val name: String,
    val perms: MutableList<EntityPermission> = arrayListOf()
) : Base(id, name)

data class SsmProject(
    val pjName:String,
    val entities: List<Entity>,
    val actors: List<Actor>
){

    //生成全部实体代码（实体id to 代码）
    fun genEntityCodes():Map<String,String>{
        val map = hashMapOf<String,String>()
        for (entity in entities) {
            val tl = FREEMARKER_CONF.getTemplate("entity.ftl")
            val out = StringWriter()
            tl.process(mapOf("entity" to entity),out)
            map += entity.id to out.toString()
        }
        return map
    }
    companion object{
        fun fromDsl(pjName:String?, entityDsl:String?, permDsl:String?):SsmProject{
            if(pjName.isNullOrBlank() || entityDsl.isNullOrBlank() || permDsl.isNullOrBlank())
                throw SsmException("输入不能为空")
            //中文to英文
            val nameToId = hashMapOf<String,String>()
            val entities = handleEntityDsl(nameToId,entityDsl)
            optimizeEntities(nameToId,entities)
            val actors = handlePermDsl(entities, nameToId, permDsl)
            return SsmProject(pjName,entities,actors)
        }
        private fun handleEntityDsl( nameToId: MutableMap<String,String>, dsl:String) : List<Entity>{
            val entityLines = dsl.splitByReturn()
            val entities = arrayListOf<Entity>()
            for ((i, entityLine) in entityLines.withIndex()) {
                val fieldTokens = entityLine.splitBySpace().toMutableList()
                val entityToken = fieldTokens.removeFirst()
                val entityName = entityToken.extractChinese()?:"实体${i}"
                val entityId = entityToken.extractEnglish()?:entityName.toPinyin()
                nameToId += entityName to entityId
                val fields = arrayListOf<Field>()
                for ((j, token) in fieldTokens.withIndex()) {
                    val fieldName = token.extractChinese()?:"字段${j}"
                    val fieldId = nameToId[fieldName]
                        ?:token.extractEnglish()
                        ?:fieldName.toPinyin()
                            .also { nameToId += fieldName to it }
                    fields += Field(fieldId,fieldName)
                }
                entities += Entity(entityId,entityName,fields)
            }
            return entities
        }
        private fun optimizeEntities(nameToId: Map<String, String>, oldEntities: List<Entity>):List<Entity>{
            val entities = oldEntities.toMutableList()
            //为全项目加上系统角色和系统用户实体
            entities += Entity("role", "角色", mutableListOf())
            entities += Entity("user","用户", mutableListOf(
                Field("id", "用户名"),
                Field("pwd", "密码"),
                Field("role", "角色")
            ))

            entities.forEach { entity ->
                //实体0属性，自动加上id name属性（xx编号，xx名称）
                if(entity.fields.isEmpty()){
                    entity.fields += Field("id",entity.name+"编号")
                    entity.fields += Field("name",entity.name+"名称")
                }
                //字段是实体，更改类型
                entity.fields.forEach { field ->
                    val asso = entities.find { it.name == field.name }
                    if(asso != null){
                        field.type = asso.capId
                    }
                }
            }

            return entities
        }
        private fun handlePermDsl(entities: List<Entity>, nameToId: MutableMap<String,String>, dsl:String): List<Actor>{
            val permLines = dsl.splitByReturn()
            val actors = arrayListOf<Actor>()
            var actorNow:Actor?=null
            for ((i, permLine) in permLines.withIndex()) {
                //创建新的角色
                if(permLine.extractEnglish()!=null){
                    val actorName = permLine.extractChinese()?:"角色$i"
                    val actorId = nameToId[actorName]
                        ?:permLine.extractEnglish()
                        ?:actorName.toPinyin()
                            .also { nameToId += actorName to it }
                    actorNow = Actor(actorId,actorName)
                    continue
                }
                //处理当前角色
                if(actorNow !=null){
                    val permTokens = permLine.splitBySpace()
                    val entityName = permTokens[0]
                    val permissionStr = permTokens[1]
                    //处理全部实体权限
                    if(entityName == "全部"){
                        entities.forEach { entity ->
                            handleActorPerms(permissionStr,entity,actorNow)
                        }
                    }
                    //处理单个实体权限
                    else{
                        val entity = entities.find { it.name==entityName }
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
