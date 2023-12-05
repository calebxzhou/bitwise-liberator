package calebxzhou.liberator

import com.github.houbb.pinyin.constant.enums.PinyinStyleEnum
import com.github.houbb.pinyin.util.PinyinHelper

//将大列表按 相同分隔符 分成小列表 eg [11102220333].splitList(0) -> [[111],[222],[333]]
fun <T> List<T>.splitList(separator: T) = this.fold(mutableListOf(mutableListOf<T>())) { acc, t ->
    if (t == separator) acc += mutableListOf<T>()
    if (t != separator) acc.last() += t
    acc
}

//大列表 取中间项目  eg  [1111a222222b33333]takeBetween(a,b) -> [[111],[2222222],[33333]]
fun <T> List<T>.takeBetween(sep1: T?, sep2: T?) = this.dropWhile { it != sep1 }.drop(1).takeWhile { it != sep2 }

//把abcd \n efgh \n ijkl这样的字符串转成map，每个entry里a（第1元素）是key,[bcd] （剩余元素）是value
fun stringMapFirstAsso(input: String): Map<String, List<String>> {
    return input.split("\n").map { it.split(" ") }.associate { it.first() to it.drop(1) }
}

fun String.splitBySpace() =
    this.trim().split(Regex("\\s+"))
        .filter { it.isNotBlank() }
        .toMutableList()
fun String.splitByReturn() =
    this.trim().split("\n")
        .filter { it.isNotBlank() }
        .toMutableList()
fun String.extractChinese() =
    Regex("([\\u4e00-\\u9fff]+)")
        .find(this)?.value

fun String.extractEnglish() =
    Regex("([A-Za-z]+)")
        .find(this)?.value
fun String.toPinyin()=
    PinyinHelper.toPinyin(this, PinyinStyleEnum.NORMAL,"")
fun Int.isEven() = this % 2 == 0