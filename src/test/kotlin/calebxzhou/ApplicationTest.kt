package calebxzhou

import calebxzhou.codenliberate.model.*
import freemarker.template.Configuration
import freemarker.template.TemplateExceptionHandler
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.StringWriter
import java.nio.file.Files
import java.nio.file.Files.walk
import java.nio.file.Path
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.walk

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
        if(it.scope == CodeTemplateScope.FOR_SINGLE_ENTITY){
            for(entity in pj.entities){
                val dataModel = mapOf("entity" to entity)
                val out = StringWriter()
                when (it.type) {
                    CodeTemplateCategory.JSP -> {
                        zipOut.putNextEntry(ZipEntry("${entity.id.decapitalize()}_${it.name.replace("jsp_","")}.jsp"))
                    }
                    CodeTemplateCategory.ENTITY -> {
                        zipOut.putNextEntry(ZipEntry("${entity.id}.java"))
                    }
                    else -> {
                        zipOut.putNextEntry(ZipEntry("${entity.id}${it.javaFileName}.java"))
                    }
                }
                template.process(dataModel,out)
                zipOut.write(out.toString().toByteArray())
                zipOut.closeEntry()
            }
        }else if(it.scope == CodeTemplateScope.FOR_ALL_PROJECT){
            val out = StringWriter()
            zipOut.putNextEntry(ZipEntry("${it.javaFileName}.${it.type.extension}"))
            template.process(pjModel,out)
            zipOut.write(out.toString().toByteArray())
            zipOut.closeEntry()
        }

    }
    zipOut.close()
}
