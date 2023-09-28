package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.TokenType.*

object Lexer {
    //词法分析
    fun analyze(input: String): List<Token> {
        return processToken(scanAndSplit(input))
    }

    //按照分隔符 分割出token
    fun scanAndSplit(input: String) : List<String>{
        val result = mutableListOf<String>()
        var currentString = ""
        for (char in input) {
            if (char == ' ' || char == '\n' || char == '\r') {
                if (currentString.isNotEmpty()) {
                    result += currentString
                    currentString = ""
                }
            } else {
                currentString += char
            }
        }

        if (currentString.isNotEmpty()) {
            result += currentString
        }

        return result
    }
    //处理分隔符
    fun processToken(tokenStrList: List<String>): List<Token>{
        val tokens = mutableListOf<Token>()

        tokenStrList.forEach { word ->
            tokens += when {
                KEYWORD.match(word) -> Token(KEYWORD,word)
                SEPARATOR.match(word) -> Token(SEPARATOR,word)
                IDENTIFIER.match(word) -> Token(IDENTIFIER,word)
                LITERAL.match(word) -> Token(LITERAL,word)
                else -> throw LexicalException(word)
            }
        }


        return tokens
    }
}