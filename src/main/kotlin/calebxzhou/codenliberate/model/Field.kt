package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:23.
 */
@Serializable
data class Field(val id:String, val name:String, val type:String, val entity:Entity){
    val capId = id.capitalize()
}
