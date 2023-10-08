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
    val nexts = mutableListOf<Node<T>>()
    operator fun plusAssign(node: Node<T>){
        nexts += node
    }



}
