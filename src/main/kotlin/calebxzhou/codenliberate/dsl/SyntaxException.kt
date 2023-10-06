package calebxzhou.codenliberate.dsl

class SyntaxException(err: String) : Exception("语法分析错误！$err") {
}