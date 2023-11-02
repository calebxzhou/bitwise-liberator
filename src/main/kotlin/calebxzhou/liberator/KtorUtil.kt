package calebxzhou.liberator

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import java.io.ByteArrayOutputStream

suspend fun ApplicationCall.respondDocx(byteOut: ByteArrayOutputStream){
    respondBytes(byteOut.toByteArray(), contentType =  ContentType.Application.Docx)
}