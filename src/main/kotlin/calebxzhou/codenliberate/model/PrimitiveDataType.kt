package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-23,20:51.
 */

@Serializable
data class PrimitiveDataType(
    override val javaType:String,
    override val dbType:String,
    override val name:String,
    ) : FieldDataType {
        companion object{
            val INT = PrimitiveDataType("Integer","int","整数")
            val LONG = PrimitiveDataType("Long","bigint","21亿以上的整数")
            val DOUBLE = PrimitiveDataType("Double","float(53)","小数")
            val DATE = PrimitiveDataType("Long","bigint","日期")
            val DATE_TIME = PrimitiveDataType("Long","bigint","日期与时间")
            val STRING = PrimitiveDataType("String","nvarchar(500)","文字")
        }
}