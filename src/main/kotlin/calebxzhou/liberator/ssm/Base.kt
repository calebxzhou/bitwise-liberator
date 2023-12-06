package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,22:33.
 */

open class Base(
    open val id: String,
    open val name: String
) {
    val capId
        get() = id.capitalize()
    val uncapId
        get() = id.decapitalize()
}