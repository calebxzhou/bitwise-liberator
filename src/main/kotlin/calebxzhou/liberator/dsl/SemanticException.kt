package calebxzhou.liberator.dsl

class SemanticException( err: String) : Exception("语义分析错误！\n$err") {
}