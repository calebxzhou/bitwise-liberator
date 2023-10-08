package calebxzhou.codenliberate.dsl

class LexicalException(line: Int, word: String) : Exception("词法分析错误！\n第${line}行：不允许出现无效字符：$word") {
}