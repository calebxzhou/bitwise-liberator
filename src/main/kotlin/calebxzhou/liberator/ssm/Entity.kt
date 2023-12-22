package calebxzhou.liberator.ssm


/**
 * Created  on 2023-12-06,22:34.
 */
data class Entity(
    override val id: String,
    override val name: String,
    //权限 角色名to 权限
    val perms: MutableMap<String,MutableSet<Permission>> = hashMapOf(),
    val fields: MutableList<Field> = arrayListOf()
) : IdNameBase(id, name) {
    //允许访问的条件
    val accessibleRoles
        get() = perms.keys.joinToString("||") { "user.roleName == '${it}'" }
    //允许crud的条件
    val insertableRoles
        get() = perms.filter { Permission.INSERT in it.value }.keys.joinToString("||") { "user.roleName == '${it}'" }
    val editableRoles
        get() = perms.filter { Permission.UPDATE in it.value }.keys.joinToString("||") { "user.roleName == '${it}'" }
    val deletableRoles
        get() = perms.filter { Permission.DELETE in it.value }.keys.joinToString("||") { "user.roleName == '${it}'" }

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
        }
    //实体类字段（插入用 字段有关联实体的 = 对方主键）
    val classFields
        get() = fields

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
                lines += "${field.id} INT AUTO_INCREMENT PRIMARY KEY"
            } else {
                if (!fieldHasEntityRef(field)) {
                    lines += "${field.id} ${Field.NORMAL_DTYPE} not null"
                } else {
                    fieldRefMap[field]?.let { refEntity ->
                        lines += "${field.parentEntityId}_${refEntity.primaryKey.id} ${Field.ID_DTYPE} not null"
                               // "FOREIGN KEY REFERENCES ${refEntity.id}(${refEntity.primaryKey.id}) not null"
                    }
                }
            }
        }
        for(field in fields.filter { fieldHasEntityRef(it) }){
            fieldRefMap[field]?.let { refEntity ->
                lines += "foreign key (${field.parentEntityId}_${refEntity.primaryKey.id}) references ${refEntity.id}(${refEntity.primaryKey.id})"
            }

        }
        return lines.joinToString(",\n")
    }

    // +=field 是添加字段
    operator fun plusAssign(field: Field) {
        if(fields.size==0)
            primaryKey = field
        fields+= field
    }


}