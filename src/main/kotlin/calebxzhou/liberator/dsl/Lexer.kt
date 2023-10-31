package calebxzhou.liberator.dsl

import calebxzhou.liberator.dsl.TokenType.*

class Lexer(val input:String) {
    //词法分析
    fun analyze(): List<Token> {
        return processToken(scanAndSplit())
    }
    //按照分隔符 分割出token
    private fun scanAndSplit() : List<String>{
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
    private fun processToken(tokenStrList: List<String>): List<Token> = tokenStrList.mapIndexed {i, word ->
        when {
            KEYWORD.match(word) -> KeywordToken.ofLiteral(word)
            SEPARATOR.match(word) -> SeparatorToken.ofLiteral(word)
            IDENTIFIER.match(word) -> IdToken(word)
            CHINESE.match(word) -> ChineseToken(word)
            else -> throw LexicalException(i,word)
        }?:throw LexicalException(i,word)
    }
}