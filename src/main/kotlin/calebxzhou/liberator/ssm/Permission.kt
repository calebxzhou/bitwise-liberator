package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-08,19:43.
 */
enum class Permission(private val keyword: String) {
    SELECT("r"),
    DELETE("d"),
    UPDATE("u"),
    INSERT("c");
    companion object{
        val all =  Permission.entries.toTypedArray().toMutableSet()
        fun match(keywords:String) = entries.filter { keywords.contains(it.keyword) }.toMutableSet()
    }

}