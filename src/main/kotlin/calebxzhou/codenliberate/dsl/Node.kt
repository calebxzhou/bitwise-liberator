package calebxzhou.codenliberate.dsl

/**
 * Created  on 2023-10-01,7:44.
 */
data class Node<T>(val value:T?) {
    val nexts = mutableListOf<Node<T>>()
    operator fun plusAssign(node: Node<T>){
        nexts += node
    }
}
