package calebxzhou.liberator.pjtest

import calebxzhou.getResource
import calebxzhou.liberator.msword.TableOptimizer
import calebxzhou.poiConfigure
import com.deepoove.poi.XWPFTemplate
import com.deepoove.poi.data.RowRenderData
import com.deepoove.poi.data.Rows
import com.deepoove.poi.data.Tables
import com.deepoove.poi.xwpf.NiceXWPFDocument
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

/**
 * Created  on 2023-11-01,20:19.
 */
//测试用例
@Serializable
data class TestCase(
    //测试项
    val name:String,
    //描述输入/操作
    val operation:String,
    //期望+真实结果
    val result:String
){
    fun getRenderData(id: Int) = Rows.of("$id", name, operation, result,result,"一致").textColor("000000")
        .bgColor("FFFFFF").center().create()
}
//模块测试
@Serializable
data class ModuleTest(
    //模块名
    val name:String,
    //全部测试用例
    val cases:MutableList<TestCase> = arrayListOf()
){
    val columnTable : Any
        get() {
            val rowRenderDataList = arrayListOf<RowRenderData>()
            val header: RowRenderData = Rows.of("编号","测试项","描述输入/操作","预计结果","实际结果","结果对比")
                .horizontalCenter()
                .textColor("000000")
                .bgColor("FFFFFF").center().create()
            rowRenderDataList.add(header)
            cases.mapIndexedTo(rowRenderDataList){ index, testCase -> testCase.getRenderData(index) }
            return Tables.create(*rowRenderDataList.toTypedArray<RowRenderData>())
        }
}
//项目测试
@Serializable
data class PjTest(
    //全部模块测试
    val modules:  List<ModuleTest> = arrayListOf()
){
    companion object{
        fun fromJson(json:String): PjTest{
            val modules: List<ModuleTest> = Json.decodeFromString(json)
            return PjTest(modules);
        }
    }
    //编号	测试项	描述输入/操作	预计结果	实际结果	结果对比
    fun outputDocx(): ByteArrayOutputStream {
        val tpl = getResource("/templates/pjtest.docx")
        val stream = ByteArrayOutputStream()
        XWPFTemplate.compile(tpl, poiConfigure).render(this).write(stream)
        val niceD = NiceXWPFDocument(ByteArrayInputStream(stream.toByteArray()))
        stream.reset()
        TableOptimizer.run(niceD).write(stream)
        return stream
    }
}
