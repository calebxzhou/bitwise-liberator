package calebxzhou.codenliberate.model

enum class CodeTemplateCategory(val extension:String = "java") {
    UTIL,DAO,DAO_IMPL,SERVLET,SQL,JSP("jsp"),MISC,ENTITY;

}