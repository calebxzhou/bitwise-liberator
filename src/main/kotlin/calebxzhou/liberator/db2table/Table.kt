package calebxzhou.liberator.db2table

import com.deepoove.poi.data.RowRenderData
import com.deepoove.poi.data.Rows

data class Table(val name:String,val id:String,val columns:MutableList<Column> = arrayListOf()) {
    val allColumns
    get() = columns.joinToString("、") { it.name }
    //获取文档中 “数据库设计”的表格行部分
    val columnTable: List<RowRenderData>
        get() {
        val rowRenderDataList = arrayListOf<RowRenderData>()
        val header: RowRenderData = Rows.of("属性", "列名", "数据类型", "长度", "约束")
            .horizontalCenter()
            .textBold()
            .textColor("000000")
            .bgColor("FFFFFF").center().create()
        rowRenderDataList.add(header)
            columns.mapTo(rowRenderDataList) { it.renderData }
        return rowRenderDataList
    }
}
