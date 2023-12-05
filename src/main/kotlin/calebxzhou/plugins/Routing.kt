package calebxzhou.plugins

import calebxzhou.FM_CONF
import calebxzhou.liberator.db2table.Db2Table
import calebxzhou.liberator.diagram.actogram.Actogram
import calebxzhou.liberator.dsl.*
import calebxzhou.liberator.diagram.fumodiam.Fumodiam
import calebxzhou.liberator.headfoot.HeadFoot
import calebxzhou.liberator.model.CodeTemplate
import calebxzhou.liberator.model.CodeTemplateScope
import calebxzhou.liberator.respondDocx
import calebxzhou.liberator.ssm.SsmProject
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.routing.post
import java.io.ByteArrayOutputStream
import java.io.StringWriter
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

fun Application.configureRouting() {

    routing {
        staticResources("/","frontend")
        post("/ssm_do") {
            val params = call.receiveParameters()
            val pjName = params["pjName"]
            val entities = params["entities"]
            val perm = params["perm"]
            call.respond(SsmProject.fromDsl(pjName, entities, perm).toString())
           /* Lexer(dslCode).analyze().let {
                val node = Syntax(it).analyze()
                Semantic(node).analyze()
                val pj = CodeGen(node).makeProject()
                val bytes = ByteArrayOutputStream()
                val zipOut = ZipOutputStream(bytes)
                val pjModel = mapOf("project" to pj)
                CodeTemplate.all.forEach {
                    val template = FM_CONF.getTemplate(it.name+".ftl")
                    if(it.scope == CodeTemplateScope.SINGLE_ENTITY){
                        //模板对于每个实体
                        for(entity in pj.entities){
                            val dataModel = mapOf("entity" to entity)
                            val out = StringWriter()
                            zipOut.putNextEntry(ZipEntry(it.getOutputFilePath(entity.id)))
                            template.process(dataModel,out)
                            zipOut.write(out.toString().toByteArray())
                            zipOut.closeEntry()
                        }
                    }else if(it.scope == CodeTemplateScope.ALL_PROJECT){
                        //模板对于整个项目
                        val out = StringWriter()
                        zipOut.putNextEntry(ZipEntry(it.getOutputFilePath()))
                        template.process(pjModel,out)
                        zipOut.write(out.toString().toByteArray())
                        zipOut.closeEntry()
                    }
                }
                zipOut.close()
                call.respondBytes(bytes.toByteArray(), contentType = ContentType.Application.Zip)
            }*/
        }
        post("/fumogram_do"){
            call.receiveParameters()["dsl"]?.let { dsl ->
                Fumodiam.fromDsl(dsl).draw().let { image->
                    call.respondBytes(image,ContentType.Image.SVG)
                }
            }
        }
        post("/actogram_do"){
            call.receiveParameters()["dsl"]?.let { dsl ->
                Actogram.fromDsl(dsl).draw().let { image->
                    call.respondBytes(image,ContentType.Image.SVG)
                }
            }
        }
        post("/db2table_do"){
            call.receiveParameters()["dsl"]?.let { dsl->
                Db2Table.compileDsl(dsl).outputDocx().let { docx->
                    call.respondDocx(docx)
                }
            }
        }
        post("/headfoot_do"){
            val (dsl, fileBytes) = call.receiveMultipart().readAllParts()
                .fold(String() to ByteArray(0)) { acc, part ->
                when (part) {
                    is PartData.FormItem -> {
                        when (part.name) {
                            "dsl" -> part.value to acc.second
                            else -> acc
                        }
                    }
                    is PartData.FileItem -> {
                        when (part.name) {
                            "file" -> acc.first to part.streamProvider().readBytes()
                            else -> acc
                        }
                    }
                    else -> acc
                }.also { part.dispose() }
            }
            HeadFoot.fromDsl(dsl).processDocx(fileBytes).let { bytes ->
                call.respondDocx(bytes)
            }
        }
    }
}
