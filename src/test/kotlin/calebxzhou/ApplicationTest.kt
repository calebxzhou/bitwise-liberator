package calebxzhou

import calebxzhou.codenliberate.model.*
import freemarker.template.Configuration
import freemarker.template.TemplateExceptionHandler
import java.io.FileOutputStream
import java.io.StringWriter
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class ApplicationTest
fun main() {
    val cfg = Configuration(Configuration.VERSION_2_3_30).apply {
        setClassForTemplateLoading(this::class.java, "/templates")
        defaultEncoding = "UTF-8"
        templateExceptionHandler = TemplateExceptionHandler.RETHROW_HANDLER
        logTemplateExceptions = false
        wrapUncheckedExceptions = true
    }
    val pj = Project(
        "TESTPROJ", ProjectArch.BS, DbBrand.MYSQL, listOf(
            Entity(
                "Entity1", "实体1", listOf(
                    Field("id", "编号", "String"),
                    Field("field1", "字段1", "String"),
                    Field("field2", "字段2", "String"),
                    Field("field3", "字段3", "String"),
                    Field("field4", "字段4", "String"),
                    Field("field5", "字段5", "String")
                )
            ),
            Entity(
                "Entity2", "实体2", listOf(
                    Field("id", "编号", "String"),
                    Field("field1", "字段1", "String"),
                    Field("field2", "字段2", "String"),
                    Field("field3", "字段3", "String"),
                    Field("field4", "字段4", "String"),
                    Field("field5", "字段5", "String")
                )
            ),
            Entity(
                "Entity3", "实体3", listOf(
                    Field("id", "编号", "String"),
                    Field("field1", "字段1", "String"),
                    Field("field2", "字段2", "String"),
                    Field("field3", "字段3", "String"),
                    Field("field4", "字段4", "String"),
                    Field("field5", "字段5", "String")
                )
            ),
        )
    )
    //val zipOut = ZipOutputStream(ByteArrayOutputStream())
    val zipOut = ZipOutputStream(FileOutputStream("1.zip"))
    val pjModel = mapOf("project" to pj)
    CodeTemplate.all.forEach {
        val template = cfg.getTemplate(it.name+".ftl")
        if(it.scope == CodeTemplateScope.SINGLE_ENTITY){
            //模板对于每个实体
            for(entity in pj.entities){
                val dataModel = mapOf("entity" to entity)
                val out = StringWriter()
                when (it.cate) {
                    CodeTemplateCategory.JSP -> {
                        zipOut.putNextEntry(ZipEntry("${it.cate.dir}/${entity.id.decapitalize()}_${it.name.replace("jsp_","")}.jsp"))
                    }
                    CodeTemplateCategory.ENTITY -> {
                        zipOut.putNextEntry(ZipEntry("${it.cate.dir}/${entity.id}.java"))
                    }
                    else -> {
                        zipOut.putNextEntry(ZipEntry("${it.cate.dir}/${entity.id}${it.fileName}.java"))
                    }
                }
                template.process(dataModel,out)
                zipOut.write(out.toString().toByteArray())
                zipOut.closeEntry()
            }
        }else if(it.scope == CodeTemplateScope.ALL_PROJECT){
            //模板对于整个项目
            val out = StringWriter()
            zipOut.putNextEntry(ZipEntry("${it.cate.dir}/${it.fileName}.${it.cate.extension}"))
            template.process(pjModel,out)
            zipOut.write(out.toString().toByteArray())
            zipOut.closeEntry()
        }

    }
    zipOut.close()
}
