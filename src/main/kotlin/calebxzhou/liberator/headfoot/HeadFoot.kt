package calebxzhou.liberator.headfoot

import calebxzhou.liberator.DslInstantiable
import com.deepoove.poi.xwpf.NiceXWPFDocument
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

data class HeadFootSection(
    val startPage:Int=1,
    val endPage:Int=-1,
    val header:String,
    val footerType:Int //0没页码 1阿拉伯 2罗马
)
data class HeadFoot(val sections: List<HeadFootSection>){
    companion object:DslInstantiable<HeadFoot>{
        override fun fromDsl(dsl:String):HeadFoot{
            val sections = arrayListOf<HeadFootSection>()
            val rows = dsl.split("\n")
            for(row in rows){
                val words = row.split(" ").toMutableList()
                val pageRange = words.removeFirst().split("-")
                val startPage = pageRange[0].toInt()
                val endPage = pageRange.getOrNull(1)?.toInt()?:-1
                val footerType = when(words.removeLast()){
                    "无页码"->0
                    "页码阿拉伯数字"->1
                    "页码罗马数字"->2
                    else ->0
                }
                val header = words.joinToString { " " }
                sections += HeadFootSection(startPage, endPage, header, footerType)
            }
            return HeadFoot(sections)
        }
    }
    //创建页眉样式

    //创建页脚样式（页码）
    fun processDocx(fileData:ByteArray):ByteArrayOutputStream{
        val doc = NiceXWPFDocument(ByteArrayInputStream(fileData))
        //先删除所有页眉页脚
        doc.headerList.forEach { it.paragraphs.clear() }
        doc.footerList.forEach { it.paragraphs.clear() }


        return ByteArrayOutputStream().also { doc.write(it) }
    }


}
