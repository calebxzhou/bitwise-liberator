package calebxzhou.liberator.pjtest

/**
 * Created  on 2023-11-01,20:19.
 */
//测试用例
data class TestCase(
    //测试项
    val name:String,
    //描述输入/操作
    val operation:String,
    //期望+真实结果
    val result:String
)
//功能测试
data class FuncTest(
    //功能名
    val name:String,
    //全部测试用例
    val cases:MutableList<TestCase> = arrayListOf()
)
//模块测试
data class ModuleTest(
    //模块名
    val name:String,
    //全部功能测试
    val funcs:MutableList<FuncTest> = arrayListOf()
)
//项目测试
data class PjTest(
    //项目名
    val name: String,
    //全部模块测试
    val modules: MutableList<ModuleTest> = arrayListOf()
){
    companion object{
        fun fromDsl(dsl:String): PjTest{
            val rows = dsl.split("\n").toMutableList()
            val pjName = rows.removeFirst()
            val modules = mutableListOf<ModuleTest>()
            val module: ModuleTest? = null
            for(row in rows){
                if(row.endsWith("模块")){
                    //TODO functional
                }
            }

            return PjTest(pjName)
        }
    }
}
