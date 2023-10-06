package calebxzhou.codenliberate.dsl

/**
 * Created  on 2023-10-02,22:01.
 */
interface SyntaxEvaluator :Evaluator <Token> {
    override val eval: (Token) -> Boolean
}