package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable


@Serializable
sealed interface FieldDataType{
    val javaType:String
    val dbType:String
    val name:String


}
