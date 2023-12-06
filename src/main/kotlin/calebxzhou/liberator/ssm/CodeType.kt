package calebxzhou.liberator.ssm

/**
 * Created  on 2023-12-06,17:53.
 */


enum class CodeType(
    val templatePath: String,
    private val outDir: String,
    val outSuffix:String="",
    val ext:String="java",
    val forGlobal:Boolean = false,
){
    APP_CTX("ssm/applicationContext.xml.ftl", WEB_INF_OUT_PATH,"applicationContext","xml",true),
    CONTROLLER("ssm/controller.ftl","$SSM_OUT_PATH/controller","Controller"),
    EDIT_JSP("ssm/edit.jsp.ftl","$WEB_INF_OUT_PATH/jsp","_edit","jsp"),
    INSERT_JSP("ssm/insert.jsp.ftl","$WEB_INF_OUT_PATH/jsp","_insert","jsp"),
    SELECT_ALL_JSP("ssm/select_all.jsp.ftl","$WEB_INF_OUT_PATH/jsp","_select_all","jsp"),

    POJO("entity.ftl", "$SSM_OUT_PATH/entity"),
    SERVICE("ssm/service.ftl","$SSM_OUT_PATH/service","Service"),
    MAPPER("ssm/mapper.ftl","$SSM_OUT_PATH/mapper","Mapper"),
    MAPPER_XML("ssm/mapper_xml.ftl","$SSM_OUT_PATH/mapper/xml","Mapper","xml"),
    WEB_XML("ssm/web.xml.ftl", WEB_INF_OUT_PATH,"web","xml",true)
    ;

    fun getOutPath(fileName:String)="$outDir/$fileName$outSuffix.$ext"

}