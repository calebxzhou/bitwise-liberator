package calebxzhou.liberator.ssm.report
//系统功能设计
data class SystemFunctionDesign(
    val name:String,
    val info:String,
)
//模块
data class SystemModule(
    val name:String,
    val funcs: List<SystemFunctionDesign>
)

data class SsmReport(
    val pjName:String,
    val studentId:String,
    val studentName:String,
    val teacher:String,
    //开发环境
    val devEnv:String,
    //实现目标
    val pjTarget:String,
    //摘要
    val abstract:String,
    //需求分析
    val demand:String,
)
