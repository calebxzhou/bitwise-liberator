package calebxzhou.codenliberate.dsl

class SyntaxException(lineNum:Int,err: String) : Exception("语法分析错误！\n第${lineNum+1}行：$err") {
}