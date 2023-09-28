package calebxzhou.plugins

import calebxzhou.codenliberate.dsl.Lexer
import calebxzhou.codenliberate.model.Project
import io.ktor.server.application.*
import io.ktor.server.freemarker.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.routing.post

fun Application.configureRouting() {

    routing {
        staticResources("/","frontend") {
        }
        post("/generate") {
            //如果实体没有id属性，那么会自动加上id属性（xx编号）
            //如果实体没有声明属性，那么会自动加上id、name属性（xx编号，xx名称）
            //如果系统用户角色没有管理员，那么自动加上管理员
            //如果系统管理员不是最高权限，那么自动设置为最高权限
            //为全项目加上系统角色和系统用户表
            //为每个实体添加comment属性（comment：String/nvarchar200）
            val dslCode = call.receiveParameters()["dsl"]?:return@post
            call.respond(Lexer.analyze(dslCode).toString())
        }
    }
}
