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
    LOGIN_JSP("ssm/login.jsp.ftl","$WEB_INF_OUT_PATH/jsp","login","jsp",true),
    MAIN_JSP("ssm/main.jsp.ftl","$WEB_INF_OUT_PATH/jsp","main","jsp",true),

    POJO("entity.ftl", "$SSM_OUT_PATH/entity"),
    SERVICE("ssm/service.ftl","$SSM_OUT_PATH/service","Service"),
    MAPPER("ssm/mapper.ftl","$SSM_OUT_PATH/mapper","Mapper"),
    WEB_XML("ssm/web.xml.ftl", WEB_INF_OUT_PATH,"web","xml",true),
    APP_CONFIG("ssm/appconfig.ftl", SSM_OUT_PATH,"AppConfig","java",true),
    SQL("sql.ftl", JAVA_OUT_PATH,"init","sql",true),
    LOGIN_CONTROLLER("ssm/loginController.java", "$SSM_OUT_PATH/controller","LoginController","java",true),
    ;


    fun getOutPath(fileName:String)="$outDir/$fileName$outSuffix.$ext"

}