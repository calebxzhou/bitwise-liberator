package calebxzhou.liberator.ssm


/**
 * Created  on 2023-12-06,22:34.
 */
data class Entity(
    override val id: String,
    override val name: String,
    private val fieldMap: LinkedHashMap<String, Field> = linkedMapOf()
) : IdNameBase(id, name) {
    //所有字段（有关联的放在最后）
    val fields
        get() = fieldMap.values//.sortedBy { fieldRefMap[it] != null }
    //vo字段（查询用 关联的实体 除对方主键 全部展开）
    val voFields: List<Field>
        get() {
            val voFields = mutableListOf<Field>()
            for (f in fields) {
                if (fieldRefMap.containsKey(f)) {
                    val entity = fieldRefMap[f]
                    entity?.fields?.filter { it != primaryKey }.let {
                        if (it != null) {
                            voFields.addAll(it)
                        }
                    }
                }else{
                    voFields += f
                }
            }
            return voFields
        }/*fieldMap.values.filter(fieldRefMap::containsKey)
            .flatMap { field -> fieldRefMap[field]?.let { refEntity ->
                refEntity.fields.filter { refEntity.primaryKey != it }
            } ?: listOf() }*/

    //实体类字段（插入用 字段有关联实体的 = 对方主键）
    val classFields
        get() = fieldMap.values/*.map { field ->
            fieldRefMap[field]?.primaryKey ?: field
        }*/

    //主键
    var primaryKey: Field = Field("","","")

    //外键表(field to entity)
    val fieldRefMap = hashMapOf<Field, Entity>()
    //所有被关联实体
    val refEntites
        get() = fieldRefMap.values

    //是否无关联实体
    val hasNoEntityRef
    get() = fieldRefMap.isEmpty()
    //是否有关联实体
    val hasEntityRef
    get() = fieldRefMap.isNotEmpty()
    //指定字段是否有关联实体
    fun fieldHasEntityRef(field: Field) = fieldRefMap[field] != null
    fun fieldRefEntity(field: Field) = fieldRefMap[field]
    //vo视图对象id
    val voId
    get() = if (hasEntityRef) "$capId.Vo" else   capId
    //vo视图表名
    val voTable
        get() = if(hasEntityRef) "${id}_view"  else id

    val mybatisSqlUpdateSet
        get() = classFields.joinToString(",") { " ${it.id}=#{${it.id}} " }
    val mybatisSqlUpdateWhere
        get() = classFields.joinToString("and") { " ${it.id}=#{old${capId}.${it.id}} " }
    val mybatisSqlInsertColumns get() = classFields.filter { primaryKey!=it }.joinToString(",") { it.id }
    val mybatisSqlInsertValues get() = classFields.filter { primaryKey!=it }.joinToString(",") { " #{${it.id}} " }
    val mybatisSqlDeleteWhere get() = classFields.joinToString(" and ") { "${it.id}=#{${it.id}} " }
    val jspHrefParam get() = voFields.joinToString("&") { "${it.id}=\${var.${it.id}}" }

    //建表语句
    fun getSqlCreateTableColumns(): String {
        val lines = arrayListOf<String>()
        for (field in fields) {
            if (field == primaryKey) {
                lines += "${field.id} IDENTITY PRIMARY KEY not null"
            } else {
                if (!fieldHasEntityRef(field)) {
                    lines += "${field.id} ${Field.NORMAL_DTYPE} not null"
                } else {
                    fieldRefMap[field]?.let { refEntity ->
                        lines += "${field.parentEntityId}_${refEntity.primaryKey.id} ${Field.ID_DTYPE} " +
                                "REFERENCES ${refEntity.id}(${refEntity.primaryKey.id}) not null"
                    }
                }
            }
        }
        return lines.joinToString(",\n")
    }

    // +=field 是添加字段
    operator fun plusAssign(field: Field) {
        if(fieldMap.size==0)
            primaryKey = field
        fieldMap += field.id to field
    }


}