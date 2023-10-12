package calebxzhou.codenliberate.dsl

import kotlinx.serialization.Serializable

@Serializable
/**
 * Created  on 2023-10-01,8:03.
 */
//中文token（实体、字段name用）
data class ChineseToken(
    override val literal:String
):Token{
    companion object : TokenEvaluator{
        override val eval = Regex("[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]")::matches
    }
}


