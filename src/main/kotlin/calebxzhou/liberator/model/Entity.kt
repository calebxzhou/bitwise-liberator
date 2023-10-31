package calebxzhou.liberator.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:22.
 */
//单个实体
@Serializable
data class Entity(
    //标识符（英文）
    val id:String,
    //名称（中文）
    val name:String,
    //字段
    val fields: MutableList<Field>){

    //作为变量（id首字母不大写 取前三字母）
    val asVar
    get() = if(id.length<3) id else id.decapitalize().substring(0,3)
    //update sql中间的set xxx
    val updateSql = fields.joinToString(",") { it.name + "= ? " }
    val whereSql = fields.joinToString("and"){it.name + "= ? "}
    val insertPstmtValue = fields.indices.toList().map { "?" }.joinToString { "," }

}
