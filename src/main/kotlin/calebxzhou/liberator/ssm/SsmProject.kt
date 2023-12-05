package calebxzhou.liberator.ssm

import calebxzhou.liberator.*

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
    override val name: String
) : Base(id, name)

data class Entity(
    override val id: String,
    override val name: String,
    val fields: List<Field>
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
    companion object{
        fun fromDsl(pjName:String?, entityDsl:String?, permDsl:String?):SsmProject{
            if(pjName.isNullOrBlank() || entityDsl.isNullOrBlank() || permDsl.isNullOrBlank())
                throw SsmException("输入不能为空")
            //中文to英文
            val nameToId = hashMapOf<String,String>()
            val entities = handleEntityDsl(nameToId,entityDsl)
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
                    val entity = entities.find { it.name==entityName }
                        ?:throw SsmException("无效的权限设定！找不到实体“$entityName”")
                    val entityPermission = EntityPermission(entity.id)
                    val permissionStr = permTokens[1]
                    when {
                        permissionStr.contains("增") -> entityPermission.perms += Permission.INSERT
                        permissionStr.contains("删") -> entityPermission.perms += Permission.DELETE
                        permissionStr.contains("改") -> entityPermission.perms += Permission.UPDATE
                        permissionStr.contains("查") -> entityPermission.perms += Permission.SELECT
                    }
                    actorNow.perms += entityPermission
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
    }
}
class SsmException(reason:String) :Exception(reason){

}
