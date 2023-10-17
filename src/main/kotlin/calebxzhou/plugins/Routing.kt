package calebxzhou.plugins

import calebxzhou.FM_CONF
import calebxzhou.codenliberate.dsl.*
import calebxzhou.codenliberate.fumodiam.drawPicture
import calebxzhou.codenliberate.model.CodeTemplate
import calebxzhou.codenliberate.model.CodeTemplateScope
import calebxzhou.codenliberate.model.Project
import calebxzhou.json
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.freemarker.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.routing.post
import kotlinx.serialization.encodeToString
import java.io.ByteArrayOutputStream
import java.io.FileOutputStream
import java.io.StringWriter
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

fun Application.configureRouting() {

    routing {
        staticResources("/","frontend")
        post("/generate") {

            val dslCode = call.receiveParameters()["dsl"]?:return@post
            Lexer(dslCode).analyze().let {
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
            }
        }
        post("/fumodiam_do"){
            val params = call.receiveParameters()
            val dsl = params["dsl"]?:return@post
            val pjName = params["pjName"]?:return@post
            val image = drawPicture(pjName,dsl)
            call.respondBytes(image)
        }
    }
}
