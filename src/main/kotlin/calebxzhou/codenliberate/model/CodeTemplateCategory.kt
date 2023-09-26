package calebxzhou.codenliberate.model

import calebxzhou.codenliberate.model.CodeTemplate.Companion.SRC_DIR
import calebxzhou.codenliberate.model.CodeTemplate.Companion.WEBROOT_DIR

//代码模板种类
enum class CodeTemplateCategory(
    //包 目录
    val dir: String = "",
    //扩展名
    val extension:String = "java")
{
    //Java通用
    UTIL("$SRC_DIR/util"),
    ENTITY("$SRC_DIR/entity"),
    //CS-BS
    DAO("$SRC_DIR/dao"),
    DAO_IMPL("$SRC_DIR/dao/impl"),
    //BS
    SERVLET("$SRC_DIR/servlet"),
    JSP(WEBROOT_DIR,"jsp"),
    //SSM
    CONTROLLER("$SRC_DIR/controller"),
    SERVICE("$SRC_DIR/service"),
    ASPECT("$SRC_DIR/aspect"),
    MAPPER_JAVA("$SRC_DIR/mapper"),
    MAPPER_XML(SRC_DIR),
    //其他 通用
    SQL,
    MISC,

}