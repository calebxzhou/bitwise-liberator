package calebxzhou

import calebxzhou.plugins.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.freemarker.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import kotlinx.serialization.json.Json

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", watchPaths = listOf("classes"), module = Application::module)
        .start(wait = true)
}
val json = Json {
    explicitNulls = false
    useArrayPolymorphism  = true
    prettyPrint = true
}
fun Application.module() {
    configureRouting()
    install(StatusPages){
        exception<Throwable> { call ,err ->
            err.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError, err.localizedMessage)
        }
    }
    install(FreeMarker)
}
