package calebxzhou.liberator.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:23.
 */
@Serializable
data class Field(
    val id:String,
    val name:String,
    val type:FieldDataType = PrimitiveDataType.STRING){
    val capId = id.capitalize()

    //ResultSet getXXX
    val rsGet = "get${if(type==PrimitiveDataType.INT)"Int" else type.javaType}"
    //PreparedStatement setXXX
    val pstSet = "set${if(type==PrimitiveDataType.INT)"Int" else type.javaType}"
    val isEntityDataType = type is EntityDataType
}
