package calebxzhou.codenliberate.dsl

class LexicalException(word: String) : Exception("词法分析错误！不允许出现无效字符：$word") {
}