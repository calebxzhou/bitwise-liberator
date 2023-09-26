package calebxzhou.codenliberate.model

data class CodeTemplate(val name:String,val scope: CodeTemplateScope,val cate: CodeTemplateCategory){
    companion object{
        val SRC_DIR = "src/com"
        val WEBROOT_DIR = "WebRoot"
        val all = listOf(
            CodeTemplate("dao",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.DAO),
            CodeTemplate("dao_factory",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.UTIL),
            CodeTemplate("dao_impl",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.DAO_IMPL),
            CodeTemplate("db_connection",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.UTIL),
            CodeTemplate("entity",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.ENTITY),
            CodeTemplate("jsp_add",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_edit",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_login",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_main",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_queryall",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_welcome",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("servlet_add",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_delete",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_edit",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_queryall",CodeTemplateScope.SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("sql",CodeTemplateScope.ALL_PROJECT,CodeTemplateCategory.SQL),
        )
    }
    val fileName = when(cate){
        CodeTemplateCategory.JSP -> name
        else-> name.split("_").map { it.capitalize() }.joinToString("")
    }
}
