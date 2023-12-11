package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-11,20:47.
 */
data class Actor(
    val id: String,
    val perms: MutableMap<Entity,Collection<Permission>> = hashMapOf()
) {
}

