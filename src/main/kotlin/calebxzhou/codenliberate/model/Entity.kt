package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:22.
 */
@Serializable
data class Entity(val id:String,val name:String,val fields: List<Field>){
    //作为变量（id首字母不大写 取前三字母）
    val asVar = id.decapitalize().substring(0,3)
    val updateSql = fields.joinToString(",") { it.name + "= ? " }
    val whereSql = fields.joinToString("and"){it.name + "= ? "}
    val insertPstmtValue = (0 until fields.size).toList().map { "?" }.joinToString { "," }
}
