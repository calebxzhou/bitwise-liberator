package calebxzhou.codenliberate.dsl

import kotlinx.serialization.Serializable
@Serializable
sealed interface Token{
    val literal: String
}
