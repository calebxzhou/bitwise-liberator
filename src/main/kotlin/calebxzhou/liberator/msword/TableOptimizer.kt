package calebxzhou.liberator.msword

import com.deepoove.poi.xwpf.NiceXWPFDocument
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTBorder
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTcBorders
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import java.math.BigInteger

/**
 * Created  on 2023-10-31,23:13.
 */
//表格优化器 所有的表格作成标准三线表
object TableOptimizer {
    //空边
    private val emptyBorder: CTBorder = CTBorder.Factory.newInstance().apply {
        `val` = STBorder.NIL
    }

    //空边框
    private val cellEmptyBorders: CTTcBorders = CTTcBorders.Factory.newInstance().apply {
        top = emptyBorder;
        bottom = emptyBorder;
        right = emptyBorder;
        left = emptyBorder;
        insideH = emptyBorder;
        insideV = emptyBorder;
    }

    //三线表上下边框(粗 1磅)
    private val topBottomBorder: CTBorder = CTBorder.Factory.newInstance().apply {
        `val` = STBorder.SINGLE
        sz = BigInteger.valueOf(8)
        space = BigInteger.valueOf(0)
    }

    //三线表第一行下面边框（稍微细一些 0.75磅）
    private val firstRowBottomBorder: CTBorder = CTBorder.Factory.newInstance().apply {
        `val` = STBorder.SINGLE;
        sz = BigInteger.valueOf(6);
        space = BigInteger.valueOf(0);
    }

    //优化文档（所有表格变三线表）
    fun run(document: NiceXWPFDocument,cellMargin: Int): NiceXWPFDocument {
        //每个表格
        for(table in document.allTables) {

            //获取所有行
            val rows =  table.rows.toMutableList()
            //第一行：（属性 列名 etc.）只有上面和下面有边框，左面和右面没有
            val firstRow = rows.removeFirst()
            for (cell in firstRow.ctRow.tcArray) {
                val cellProp = cell.tcPr
                CTTcBorders.Factory.newInstance().apply {
                    top = topBottomBorder
                    left = emptyBorder
                    right = emptyBorder
                    bottom = firstRowBottomBorder
                    cellProp.tcBorders = this
                    cell.tcPr = cellProp
                }
            }
            //最后一行，只有下边有边框，上左下都没有边框
            val lastRow = rows.removeLast()
            for (cell in lastRow.ctRow.tcArray) {
                val cellProp = cell.tcPr
                CTTcBorders.Factory.newInstance().apply {
                    top = emptyBorder
                    left = emptyBorder
                    right = emptyBorder
                    bottom = topBottomBorder
                    cellProp.tcBorders = this
                    cell.tcPr = cellProp
                }
            }
            //剩余的中间行
            for (row in rows) {
                for (tableRowCell in row.ctRow.tcArray) {
                    //中间行每个单元格都没边框
                    tableRowCell.tcPr.tcBorders = cellEmptyBorders
                }
            }
            //设定单元格边距
            table.setCellMargins(cellMargin,cellMargin,cellMargin,cellMargin)
        }
        return document
    }
}