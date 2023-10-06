package calebxzhou.codenliberate.dsl

/**
 * Created  on 2023-10-02,21:55.
 */
interface Evaluator<T> {
    val eval: (T) -> Boolean
}