package calebxzhou.liberator.model


//实体数据类型（表关联用）
data class EntityDataType(
    val entity: Entity,
): FieldDataType {
    //java类型是此实体ID
    override val javaType: String = entity.id
    //表关联 是其他表的整数id
    override val dbType: String = "int"
    override val name: String = entity.name
}
