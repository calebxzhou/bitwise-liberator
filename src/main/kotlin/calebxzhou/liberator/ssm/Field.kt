package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,22:33.
 */

data class Field(
    override val id: String,
    override val name: String,
    val parent: Entity,
    var isPrimaryKey: Boolean = false,
    var ref: Field? = null
) : Base(id, name){
    var type = DEFAULT_TYPE

    companion object{
        const val DEFAULT_TYPE = "String"
    }
}