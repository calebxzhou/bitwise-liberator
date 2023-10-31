package calebxzhou.liberator.dsl

/**
 * Created  on 2023-10-02,21:14.
 */
class TokenList(val tokens: List<Token>) {
    var index = 0
    val hasNextToken
        get() = index <= tokens.lastIndex
    val nextToken
        get() = tokens[index]
}