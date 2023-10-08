package calebxzhou.codenliberate.dsl

import kotlinx.serialization.Serializable

@Serializable
/**
 * Created  on 2023-10-01,7:47.
 */
enum class KeywordToken(override val literal: String) : Token {
    PJ_NAME("项目名称"),
    DB_BRAND("数据库品牌"),
    MYSQL("mysql"),
    MSSQL("sqlserver"),
    USR_GROUP("用户权限"),
    ENTITY_DEF("实体定义"),
    FUNC_DEF("功能定义"),
    PERM_REQ("权限要求"),
    ALL_ENTITY("全部实体"),
    INSERT("增"),
    DELETE("删"),
    UPDATE("改"),
    SELECT("查"),
    ;
    companion object : TokenEvaluator {
        fun ofLiteral(word: String): KeywordToken? {
            return entries.find { it.literal == word }
        }

        override val eval = KeywordToken.entries.map { it.literal }::contains
    }
}