package calebxzhou.codenliberate.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:24.
 */
@Serializable
data class Project(val name:String, val arch:ProjectArch, val dbBrand: DbBrand, val entities: List<Entity>) {

}