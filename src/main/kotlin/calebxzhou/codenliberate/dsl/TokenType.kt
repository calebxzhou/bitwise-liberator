package calebxzhou.codenliberate.dsl


enum class TokenType(private val regex: Regex) {
    KEYWORD(Regex("^(项目名称|数据库品牌|用户权限|实体定义|功能定义|权限要求|增|删|改|查|全部实体)")),
    SEPARATOR(Regex("^([{}])")),
    IDENTIFIER(Regex("[a-zA-Z_][a-zA-Z0-9_]*")),
    LITERAL(Regex("[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]")),

    ;
    fun match(string: String)= regex.matches(string)

}