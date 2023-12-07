package calebxzhou.liberator.ssm

data class FieldRef(
    private val refEntityId: String,
    private val refFieldId: String,
){
    fun getRefEntity(project: SsmProject) = project.entities[refEntityId]
    fun getRefField(project: SsmProject) = project.entities[refEntityId]?.fields?.get(refFieldId)
}
