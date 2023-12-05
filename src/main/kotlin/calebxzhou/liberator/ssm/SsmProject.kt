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
    val capId = id.capitalize()
    val uncapId = id.decapitalize()
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
    val entity: Entity,
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
        fun fromDsl(pjName:String?,entities:String?,perm:String?):SsmProject{
            if(pjName.isNullOrBlank() || entities.isNullOrBlank() || perm.isNullOrBlank())
                throw SsmException("输入不能为空")
            val entityLines = entities.splitByReturn()
            val entities = arrayListOf<Entity>()
            for ((i, entityLine) in entityLines.withIndex()) {
                val fieldTokens = entityLine.splitBySpace().toMutableList()
                val entityToken = fieldTokens.removeFirst()
                val entityName = entityToken.extractChinese()?:"实体${i}"
                val entityId = entityToken.extractEnglish()?:entityName.toPinyin()
                val fields = arrayListOf<Field>()
                for ((j, token) in fieldTokens.withIndex()) {
                    val fieldName = token.extractChinese()?:"字段${j}"
                    val fieldId = token.extractEnglish()?:fieldName.toPinyin()
                    fields += Field(fieldId,fieldName)
                }
                entities += Entity(entityId,entityName,fields)
            }
            val permLines = perm.splitByReturn()
            val actors = arrayListOf<Actor>()
            var actorNow:Actor?=null
            for ((i, permLine) in permLines.withIndex()) {
                //创建新的角色
                if(permLine.extractEnglish()!=null){
                    val actorName = permLine.extractChinese()?:"角色$i"
                    val actorId = permLine.extractEnglish()?:actorName.toPinyin()
                    actorNow = Actor(actorId,actorName)
                    continue
                }
                //处理当前角色
                if(actorNow !=null){
                    val permTokens = permLine.splitBySpace()
                    val entityName = permTokens[0]
                    val entity = entities.find { it.name==entityName }
                        ?:throw SsmException("无效的权限设定！找不到实体$entityName")
                    val entityPermission = EntityPermission(entity)
                    val permissionStr = permTokens[1]
                    if(permissionStr.contains("增")){
                        entityPermission.perms += Permission.INSERT
                    }
                    if(permissionStr.contains("删")){
                        entityPermission.perms += Permission.DELETE
                    }
                    if(permissionStr.contains("改")){
                        entityPermission.perms += Permission.UPDATE
                    }
                    if(permissionStr.contains("查")){
                        entityPermission.perms += Permission.SELECT
                    }
                }
                //下一个是新的角色 就保存当前角色
                if((permLines.getOrNull(i + 1)?.extractEnglish()) != null){
                    if(actorNow !=null){
                        actors += actorNow
                    }
                }

            }
            return SsmProject(pjName,entities,actors)
        }
    }
}
class SsmException(reason:String) :Exception(reason){

}
