package calebxzhou.codenliberate.dsl

/**
 * Created  on 2023-10-01,8:09.
 */
interface TokenEvaluator : Evaluator<String> {
    override val eval: (String) -> Boolean
}