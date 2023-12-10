package calebxzhou.liberator.ssm

import calebxzhou.liberator.extractChinese
import calebxzhou.liberator.extractEnglish
import calebxzhou.liberator.toPinyin
import java.util.*

/**
 * Created  on 2023-12-06,22:33.
 */
open class IdNameBase(
    open val id: String,
    open val name: String
) {
    val capId
        get() = id.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
    val uncapId
        get() = id.replaceFirstChar { it.lowercase(Locale.getDefault()) }
    companion object{
        fun fromToken(token:String):IdNameBase{
            val name = token.extractChinese()?:throw IllegalArgumentException("无效的token：$token，此token必须是中文英文的组合")
            val id = token.extractEnglish()
                ?:name.toPinyin()
            return IdNameBase(id,name)
        }
    }
}