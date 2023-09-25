package calebxzhou.codenliberate.model

data class CodeTemplate(val name:String,val scope: CodeTemplateScope,val type: CodeTemplateCategory){
    companion object{
        val all = listOf(
            CodeTemplate("dao",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.DAO),
            CodeTemplate("dao_factory",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.UTIL),
            CodeTemplate("dao_impl",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.DAO_IMPL),
            CodeTemplate("db_connection",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.UTIL),
            CodeTemplate("entity",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.ENTITY),
            CodeTemplate("jsp_add",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_edit",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_login",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_main",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_queryall",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.JSP),
            CodeTemplate("jsp_welcome",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.JSP),
            CodeTemplate("servlet_add",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_delete",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_edit",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("servlet_queryall",CodeTemplateScope.FOR_SINGLE_ENTITY,CodeTemplateCategory.SERVLET),
            CodeTemplate("sql",CodeTemplateScope.FOR_ALL_PROJECT,CodeTemplateCategory.SQL),
        )
    }
    val javaFileName = name.split("_").map { it.capitalize() }.joinToString("")
}
