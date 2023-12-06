package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,22:34.
 */
data class Entity(
    override val id: String,
    override val name: String,
    val fields: MutableList<Field> = arrayListOf()
) : Base(id, name){

    val mybatisSqlUpdateSet = fields.joinToString(",") { " ${it.id}=#{new${capId}.${it.id}} " }
    val mybatisSqlUpdateWhere = fields.joinToString("and"){ " ${it.id}=#{old${capId}.${it.id}} " }
    val mybatisSqlInsertValues = fields.joinToString(",") {" #{${it.id}} "}
    val mybatisSqlDeleteWhere = fields.joinToString("and"){ "${it.id}=#{${it.id}} " }
    val jspHrefParam = fields.joinToString("&") {"${it.id}=\${var.${it.id}}"}
    val primaryKey
        get() = fields.find { it.isPrimaryKey }
}