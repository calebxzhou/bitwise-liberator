package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-08,19:43.
 */
enum class Permission(private val keyword: String) {
    SELECT("增"),
    DELETE("删"),
    UPDATE("改"),
    INSERT("查");
    operator fun get(keyword:String) = entries.find { it.keyword == keyword }
}