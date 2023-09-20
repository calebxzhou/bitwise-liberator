package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:24.
 */
@Serializable
data class Project(val name:String,val entities: List<Entity>) {
}