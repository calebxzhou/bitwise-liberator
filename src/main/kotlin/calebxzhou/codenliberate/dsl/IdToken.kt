package calebxzhou.codenliberate.dsl

import kotlinx.serialization.Serializable

@Serializable
/**
 * Created  on 2023-10-01,8:03.
 */
data class IdToken(
    override val literal:String
):Token{
    companion object : TokenEvaluator{
        override val eval = Regex("[a-zA-Z_][a-zA-Z0-9_]*")::matches

    }
}


