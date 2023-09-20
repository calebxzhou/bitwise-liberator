package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:22.
 */
@Serializable
data class Entity(val id:String,val name:String,val fields: List<Field>)
