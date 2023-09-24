package calebxzhou.codenliberate.model

/**
 * Created  on 2023-09-23,20:51.
 */
enum class PrimitiveDataType(val javaType:String, val dbType:String) {
    INT("Integer","int"),
    LONG("Long","bigint"),
    DOUBLE("Double", "double"),
    STRING("String","varchar"),
}