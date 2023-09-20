package calebxzhou.plugins

import calebxzhou.codenliberate.model.Project
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") {
            val project = call.receive<Project>()

        }
    }
}
