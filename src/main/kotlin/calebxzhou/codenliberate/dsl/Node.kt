package calebxzhou.codenliberate.dsl

import calebxzhou.json
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.jetbrains.annotations.Nullable

/**
 * Created  on 2023-10-01,7:44.
 */
@Serializable
data class Node<T>(
    @Nullable
    val value:T?) {
    constructor():this(null)
    val nexts = mutableListOf<Node<T>>()

    //添加新的节点
    operator fun plusAssign(node: Node<T>){
        nexts += node
    }

    operator fun plusAssign(nodes: MutableList<Node<T>>) {
        nexts.addAll(nodes)
    }


}
