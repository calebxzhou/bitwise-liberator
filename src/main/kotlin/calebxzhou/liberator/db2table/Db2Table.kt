package calebxzhou.liberator.db2table

import calebxzhou.getResource
import calebxzhou.liberator.msword.TableOptimizer
import calebxzhou.poiConfigure
import com.deepoove.poi.XWPFTemplate
import com.deepoove.poi.data.RowRenderData
import com.deepoove.poi.data.Rows
import com.deepoove.poi.data.Tables
import com.deepoove.poi.xwpf.NiceXWPFDocument
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
data class Column(val name:String,val id:String,val type:String,val length:String,val constraint: String) {
    val renderData
        get() = Rows.of(name, id, type, length, constraint).textColor("000000")
            .bgColor("FFFFFF").center().create()
}
data class Table(val name:String,val id:String,val columns:MutableList<Column> = arrayListOf()) {
    val allColumns
        get() = columns.joinToString("、") { it.name }
    //获取文档中 “数据库设计”的表格行部分
    val columnTable : Any
        get() {
            val rowRenderDataList = arrayListOf<RowRenderData>()
            val header: RowRenderData = Rows.of("属性", "列名", "数据类型", "长度", "约束")
                .horizontalCenter()
                .textColor("000000")
                .bgColor("FFFFFF").center().create()
            rowRenderDataList.add(header)
            columns.mapTo(rowRenderDataList) { it.renderData }
            return Tables.create(*rowRenderDataList.toTypedArray<RowRenderData>())
        }
}


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


    }

    fun outputDocx(): ByteArrayOutputStream {
        val tpl = getResource("/templates/db2table.docx")
        val stream = ByteArrayOutputStream()
        XWPFTemplate.compile(tpl, poiConfigure).render(this).write(stream)
        val niceD = NiceXWPFDocument(ByteArrayInputStream(stream.toByteArray()))
        stream.reset()
        TableOptimizer.run(niceD).write(stream)
        return stream
    }
}
