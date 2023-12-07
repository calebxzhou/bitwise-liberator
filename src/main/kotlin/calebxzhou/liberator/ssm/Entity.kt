package calebxzhou.liberator.ssm


/**
 * Created  on 2023-12-06,22:34.
 */
data class Entity(
    override val id: String,
    override val name: String,
    val fields: LinkedHashMap<String,Field> = linkedMapOf()
) : IdNameBase(id, name){

    val mybatisSqlUpdateSet = fields.values.joinToString(",") { " ${it.id}=#{new${capId}.${it.id}} " }
    val mybatisSqlUpdateWhere = fields.values.joinToString("and"){ " ${it.id}=#{old${capId}.${it.id}} " }
    val mybatisSqlInsertValues = fields.values.joinToString(",") {" #{${it.id}} "}
    val mybatisSqlDeleteWhere = fields.values.joinToString("and"){ "${it.id}=#{${it.id}} " }
    val jspHrefParam = fields.values.joinToString("&") {"${it.id}=\${var.${it.id}}"}
    val primaryKey
        get() = fields.values.find { it.isPrimaryKey }

    operator fun plusAssign(field: Field){
        fields += field.id to field
    }
}