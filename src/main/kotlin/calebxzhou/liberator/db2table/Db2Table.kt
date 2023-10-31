package calebxzhou.liberator.db2table

import calebxzhou.getResource
import calebxzhou.liberator.msword.TableOptimizer
import calebxzhou.poiConfigure
import com.deepoove.poi.XWPFTemplate
import com.deepoove.poi.config.Configure
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy
import com.deepoove.poi.xwpf.NiceXWPFDocument
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream


data class Db2Table(val tables:List<Table>){
    val tableAmount = tables.size
    val allTables
    get() = tables.joinToString("、") { it.name }
    companion object{
        fun compileDsl(dsl:String): Db2Table{
            val rows = dsl.split("\n")
            val tables = mutableListOf<Table>()
            var table: Table? = null
            for (row in rows) {
                val words = row.split(" ")
                //一行有2词的是表
                if(words.size == 2){
                    table = Table(words[0],words[1])
                    continue
                }
                //一行有5词的是列
                if(words.size == 5 && table != null){
                    table.columns += Column(words[0],words[1],words[2],words[3],words[4])
                    continue
                }
                if(table != null)
                    tables += table
            }
            return Db2Table(tables)
        }
        fun outputWord(table:Db2Table): ByteArrayOutputStream {
            val tpl = getResource("/templates/db2table.docx")
            val stream = ByteArrayOutputStream()
            XWPFTemplate.compile(tpl, poiConfigure).render(table).write(stream)
            val niceD = NiceXWPFDocument(ByteArrayInputStream(stream.toByteArray()))
            stream.reset()
            TableOptimizer.run(niceD).write(stream)
            return stream
        }

    }
}
