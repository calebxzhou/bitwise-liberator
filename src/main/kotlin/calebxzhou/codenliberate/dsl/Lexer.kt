package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.TokenType.*

object Lexer {
    //词法分析
    fun analyze(input: String): List<Token> {
        return processToken(scanAndSplit(input))
    }
    //按照分隔符 分割出token
    private fun scanAndSplit(input: String) : List<String>{
        val result = mutableListOf<String>()
        var currentString = ""
        for (char in input) when (char) {
            ' ', '\r' -> if (currentString.isNotEmpty()) {
                result += currentString
                currentString = ""
            }
            else -> currentString += char
        }

        if (currentString.isNotEmpty()) {
            result += currentString
        }

        return result
    }
    //处理分隔符
    private fun processToken(tokenStrList: List<String>): List<Token> = tokenStrList.map { word ->
        when {
            KEYWORD.match(word) -> KeywordToken.ofLiteral(word)
            SEPARATOR.match(word) -> SeparatorToken.ofLiteral(word)
            IDENTIFIER.match(word) -> IdentifierToken(word)
            CHINESE.match(word) -> ChineseToken(word)
            else -> throw LexicalException(word)
        }?:throw LexicalException(word)
    }
}