package calebxzhou.codenliberate.dsl


enum class TokenType(private val evaluator: TokenEvaluator) {
    KEYWORD(KeywordToken),
    SEPARATOR(SeparatorToken),
    IDENTIFIER(IdToken),
    CHINESE(ChineseToken),

    ;
    fun match(string: String) = evaluator.eval(string)

}