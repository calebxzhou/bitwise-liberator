package calebxzhou

import calebxzhou.plugins.*
import com.deepoove.poi.config.Configure
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.freemarker.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import kotlinx.serialization.json.Json
import freemarker.template.Configuration
import freemarker.template.TemplateExceptionHandler
import io.ktor.server.plugins.cors.routing.*
import java.io.InputStream

fun main() {
    embeddedServer(Netty, port = 19000, host = "0.0.0.0", watchPaths = listOf("classes"), module = Application::module)
        .start(wait = true)
}
val json = Json {
    explicitNulls = false
    useArrayPolymorphism  = true
    prettyPrint = true
}
val FREEMARKER_CONF = Configuration(Configuration.VERSION_2_3_30).apply {
    setClassForTemplateLoading(this::class.java, "/templates")
    defaultEncoding = "UTF-8"
    templateExceptionHandler = TemplateExceptionHandler.RETHROW_HANDLER
    logTemplateExceptions = false
    wrapUncheckedExceptions = true
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
    install(CORS) {
        anyHost() // Allow requests from all hosts
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.AccessControlAllowHeaders)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowCredentials = true
        allowNonSimpleContentTypes = true
    }
}
fun getResource(path: String) : InputStream? = Application::class.java.getResourceAsStream(path)

val poiConfigure = LoopRowTableRenderPolicy().let {  Configure.builder().useSpringEL(false)
    .build() }
