package calebxzhou.plugins

import calebxzhou.codenliberate.dsl.*
import calebxzhou.codenliberate.model.Project
import calebxzhou.json
import io.ktor.server.application.*
import io.ktor.server.freemarker.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.routing.post
import kotlinx.serialization.encodeToString

fun Application.configureRouting() {

    routing {
        staticResources("/","frontend") {
        }
        post("/generate") {

            val dslCode = call.receiveParameters()["dsl"]?:return@post
            Lexer(dslCode).analyze().let {
                val node = Syntax(it).analyze()
                Semantic(node).analyze()
                val project = CodeGen(node).makeProject()
                call.respond(json.encodeToString(project))
            }
        }
    }
}
