package calebxzhou.codenliberate.model

import calebxzhou.codenliberate.model.CodeTemplateCategory.*
import calebxzhou.codenliberate.model.CodeTemplateScope.*


data class CodeTemplate(val name: String, val scope: CodeTemplateScope, val cate: CodeTemplateCategory) {
    companion object {
        val SRC_DIR = "src/com"
        val WEBROOT_DIR = "WebRoot"
        //所有代码模板
        val all = listOf(
            CodeTemplate("dao", SINGLE_ENTITY, DAO),
            CodeTemplate("dao_factory", ALL_PROJECT, UTIL),
            CodeTemplate("dao_impl", SINGLE_ENTITY, DAO_IMPL),
            CodeTemplate("db_connection", ALL_PROJECT, UTIL),
            CodeTemplate("entity", SINGLE_ENTITY, ENTITY),
            CodeTemplate("jsp_add", SINGLE_ENTITY, JSP),
            CodeTemplate("jsp_edit", SINGLE_ENTITY, JSP),
            CodeTemplate("jsp_login", ALL_PROJECT, JSP),
            CodeTemplate("jsp_main", ALL_PROJECT, JSP),
            CodeTemplate("jsp_queryall", SINGLE_ENTITY, JSP),
            CodeTemplate("jsp_welcome", ALL_PROJECT, JSP),
            CodeTemplate("servlet_add", SINGLE_ENTITY, SERVLET),
            CodeTemplate("servlet_delete", SINGLE_ENTITY, SERVLET),
            CodeTemplate("servlet_edit", SINGLE_ENTITY, SERVLET),
            CodeTemplate("servlet_queryall", SINGLE_ENTITY, SERVLET),
            CodeTemplate("sql", ALL_PROJECT, SQL),
        )
    }

    //驼峰风格文件名
    val camelCaseFileName = name.split("_").joinToString("") { it.capitalize() }
    //模板输出完整路径
    fun getOutputFilePath():String = getOutputFilePath(null)
    fun getOutputFilePath(prefix: String?): String = when (cate) {
        //对于jsp模板，去掉模板名中的jsp_
        JSP -> "${cate.dir}/${prefix?:""}${name.replace("jsp_", "")}.${cate.extension}"
        ENTITY -> "${cate.dir}/${prefix}.${cate.extension}"
        else -> {
            if (scope == SINGLE_ENTITY) {
                "${cate.dir}/${prefix}${camelCaseFileName}.${cate.extension}"
            } else {
                "${cate.dir}/${camelCaseFileName}.${cate.extension}"
            }
        }
    }

}
