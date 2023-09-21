package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:22.
 */
@Serializable
data class Entity(val id:String,val name:String,val fields: List<Field>){
    val asFieldId = id.decapitalize().substring(0,3)
    val vo = "${id}Vo"
    val voFieldId = vo.decapitalize().substring(0,3)
    val updateSql = fields.joinToString(",") { it.name + "= ? " }
    val whereSql = fields.joinToString("and"){it.name + "= ? "}
}
