package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,22:33.
 */

data class Field(
    override val id: String,
    override val name: String,
    private val parentEntityId: String,
) : IdNameBase(id, name){
    var type = NORMAL_JTYPE
    val mybatisParamType
        get() = if(type == NORMAL_JTYPE)
            "java.lang.String"
    else "com.ssm.entity.$type"

    //fun getParentEntity(project: SsmProject) = project.entityMap[parentEntityId]

    companion object{
        const val NORMAL_JTYPE = "String"
        const val NORMAL_DTYPE = "VARCHAR(255)"
        const val ID_JTYPE = "Integer"
        const val ID_DTYPE = "INT"
    }
}