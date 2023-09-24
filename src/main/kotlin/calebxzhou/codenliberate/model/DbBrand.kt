package calebxzhou.codenliberate.model

/**
 * Created  on 2023-09-21,20:08.
 */
enum class DbBrand(val driverClass: String, val localDbUrl: String, val  dbAdminUsr: String) {
    MYSQL("com.mysql.cj.jdbc.Driver","jdbc:mysql://127.0.0.1:3306/shixun","root"),
    MSSQL("com.microsoft.sqlserver.jdbc.SQLServerDriver","jdbc:sqlserver://127.0.0.1:1433; DatabaseName=shixun","sa"),
}