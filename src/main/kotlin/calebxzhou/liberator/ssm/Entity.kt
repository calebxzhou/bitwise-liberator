package calebxzhou.liberator.ssm


/**
 * Created  on 2023-12-06,22:34.
 */
data class Entity(
    override val id: String,
    override val name: String,
    val fields: LinkedHashMap<String,Field> = linkedMapOf()
) : IdNameBase(id, name){

    val mybatisSqlUpdateSet
        get() = fields.values.joinToString(",") { " ${it.id}=#{new${capId}.${it.id}} " }
    val mybatisSqlUpdateWhere
        get() = fields.values.joinToString("and"){ " ${it.id}=#{old${capId}.${it.id}} " }
    val mybatisSqlInsertValues get() =  fields.values.joinToString(",") {" #{${it.id}} "}
    val mybatisSqlDeleteWhere get() =  fields.values.joinToString(" and "){ "${it.id}=#{${it.id}} " }
    val jspHrefParam get() =  fields.values.joinToString("&") {"${it.id}=\${var.${it.id}}"}
    val primaryKey
        get() = fields.values.find { it.isPrimaryKey }

    operator fun plusAssign(field: Field){
        fields += field.id to field
    }
    val mybatisFields
        get() = fields.values.sortedBy { it.ref != null }
    fun getSqlCreateTableColumns(project: SsmProject) : String{
        return fields.values.joinToString(",\n"){field ->
            (field.ref?.let { ref ->
                "${ref.getRefEntity(project)?.capId}_${ref.getRefEntity(project)?.primaryKey?.id}"
            }?: field.id)+" VARCHAR(256)"
        }
    }
}