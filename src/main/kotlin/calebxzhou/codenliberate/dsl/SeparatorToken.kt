package calebxzhou.codenliberate.dsl

/**
 * Created  on 2023-10-01,8:00.
 */
enum class SeparatorToken(override val literal: String) : Token {
    LB("{"), RB("}"),RET("\n") ;


    companion object : TokenEvaluator {
        fun ofLiteral(word: String): SeparatorToken? {
            return entries.find { it.literal == word }
        }
        override val eval = entries.map { it.literal }::contains
    }
}