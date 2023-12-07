package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,22:33.
 */

data class Field(
    override val id: String,
    override val name: String,
    private val parentEntityId: String,
    var isPrimaryKey: Boolean = false,
    var ref: FieldRef? = null
) : IdNameBase(id, name){
    var type = DEFAULT_TYPE
    val hasRef
        get() = ref!=null
    fun getParentEntity(project: SsmProject) = project.entities[parentEntityId]
    companion object{
        const val DEFAULT_TYPE = "String"
    }
}