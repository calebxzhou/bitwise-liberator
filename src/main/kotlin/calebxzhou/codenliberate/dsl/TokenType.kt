package calebxzhou.codenliberate.dsl


enum class TokenType(private val evaluator: TokenEvaluator) {
    KEYWORD(KeywordToken),
    SEPARATOR(SeparatorToken),
    IDENTIFIER(IdentifierToken),
    CHINESE(ChineseToken),

    ;
    fun match(string: String) = evaluator.eval(string)

}