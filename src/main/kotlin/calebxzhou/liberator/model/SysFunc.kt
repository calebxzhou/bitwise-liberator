package calebxzhou.liberator.model

import kotlinx.serialization.Serializable

//系统功能定义
@Serializable
data class SysFunc(
    //权限要求
    val actor: String,
    //实体+对应权限
    var entityPerm: MutableMap<String, List<SysFuncPermission>>
) {
}