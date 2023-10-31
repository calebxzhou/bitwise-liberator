package calebxzhou.liberator.db2table

import com.deepoove.poi.data.RowRenderData
import com.deepoove.poi.data.Rows

data class Column(val name:String,val id:String,val type:String,val length:String,val constraint: String) {
    val renderData
        get() = Rows.of(name, id, type, length, constraint).textColor("000000")
            .bgColor("FFFFFF").center().create()
}