package calebxzhou.liberator.headfoot

import calebxzhou.liberator.DslInstantiable
import com.deepoove.poi.xwpf.NiceXWPFDocument
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy
import org.apache.poi.xwpf.usermodel.Borders
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTP
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPPr
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STHdrFtr
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream


data class HeadFootSection(
    val startPage:Int=1,
    val endPage:Int=-1,
    val headerText:String,
    val footerType:Int //0没页码 1阿拉伯 2罗马
){
    companion object{
        const val NO_FOOTER=0
        const val ARABIC_FOOTER=1
        const val ROMAN_FOOTER=2
    }
}
data class HeadFoot(val sections: List<HeadFootSection>){
    companion object:DslInstantiable<HeadFoot>{
        override fun fromDsl(dsl:String):HeadFoot{
            val sections = arrayListOf<HeadFootSection>()
            val rows = dsl.split("\n")
            for(row in rows){
                val words = row.split(" ").toMutableList()
                val pageRange = words.removeFirst().split("-")
                val startPage = pageRange[0].toIntOrNull()?:1
                val endPage = pageRange.getOrNull(1)?.toIntOrNull()?:-1
                val footerType = when(words.removeLast()){
                    "无页码"->0
                    "阿拉伯数字页码"->1
                    "罗马数字页码"->2
                    else ->0
                }
                val header = words.joinToString(" ")
                sections += HeadFootSection(startPage, endPage, header, footerType)
            }
            return HeadFoot(sections)
        }
    }
    fun processDocx(fileData:ByteArray):ByteArrayOutputStream{
        val doc = NiceXWPFDocument(ByteArrayInputStream(fileData))
        //先删除所有页眉页脚
        doc.headerList.forEach { it.paragraphs.clear() }
        doc.footerList.forEach { it.paragraphs.clear() }
        for (section in sections) {
            val p1 = doc.createParagraph()
            p1.alignment = ParagraphAlignment.CENTER
            p1.borderBottom= Borders.SINGLE

            val run1 = p1.createRun()
            run1.fontFamily = "SimSun"
            run1.setFontSize(21)
            run1.setText(section.headerText)


            val ctp1 = p1.ctp
            var ppr1: CTPPr? = null
            if (!ctp1.isSetPPr) {
                ctp1.addNewPPr()
            }
            ppr1 = ctp1.pPr

            var sec1: CTSectPr? = null
            if (!ppr1.isSetSectPr) {
                ppr1.addNewSectPr()
            }
            sec1 = ppr1.sectPr
            val parCTP = CTP.Factory.newInstance()
            parCTP.addNewR().addNewT().stringValue = "Header For Section 1"
            val headerPar1 = XWPFParagraph(parCTP, doc)

            val headerPars1 = arrayOf(headerPar1)

            val pol1 = XWPFHeaderFooterPolicy(doc, sec1)
            pol1.createHeader(STHdrFtr.DEFAULT, headerPars1)
        }

        return ByteArrayOutputStream().apply { doc.write(this) }
    }


}
/*
 <w:p w14:paraId="4DF9116E" w14:textId="4AEFB223" w:rsidR="00C72004" w:rsidRDefault="00000000" w:rsidP="00D849CC">
        <w:pPr>
            <w:pStyle w:val="Header"/>
            <w:tabs>
                <w:tab w:val="left" w:pos="5677"/>
            </w:tabs>
            <w:rPr>
                <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:hint="eastAsia"/>
                <w:sz w:val="21"/>
                <w:szCs w:val="21"/>
            </w:rPr>
            <w:t>沈阳工学院毕业设计（论文）</w:t>
        </w:r>
    </w:p>
    <w:p w14:paraId="671E766F" w14:textId="77777777" w:rsidR="00C72004" w:rsidRDefault="00000000">
        <w:pPr>
            <w:pStyle w:val="Header"/>
            <w:pBdr>
                <w:bottom w:val="none" w:sz="0" w:space="1" w:color="auto"/>
            </w:pBdr>
            <w:spacing w:before="240" w:after="240"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:hint="eastAsia"/>
            </w:rPr>
            <w:t xml:space="preserve"></w:t>
        </w:r>
    </w:p>
 */

/*

 */