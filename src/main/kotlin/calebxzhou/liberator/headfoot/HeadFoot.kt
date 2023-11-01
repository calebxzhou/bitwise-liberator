package calebxzhou.liberator.headfoot

import com.deepoove.poi.xwpf.NiceXWPFDocument
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

data class HeadFoot(
    val startPage:Int,
    val endPage:Int,
    val header:String,
    val useRomanNumber:Boolean,
    val docxFile: ByteArray){

    //创建页眉样式

    //创建页脚样式（页码）
    fun processDocx():ByteArrayOutputStream{
        val doc = NiceXWPFDocument(ByteArrayInputStream(docxFile))
        //先删除所有页眉页脚
        doc.headerList.forEach { it.paragraphs.clear() }
        doc.footerList.forEach { it.paragraphs.clear() }


        return ByteArrayOutputStream().also { doc.write(it) }
    }
}
