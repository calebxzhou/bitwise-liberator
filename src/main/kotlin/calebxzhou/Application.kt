package calebxzhou

import calebxzhou.plugins.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.freemarker.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", watchPaths = listOf("classes"), module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureRouting()
    install(StatusPages){
        exception<Throwable> { call ,err ->
            call.respond(HttpStatusCode.InternalServerError, err.localizedMessage)
        }
    }
    install(FreeMarker)
}
