package calebxzhou.liberator.model

import kotlinx.serialization.Serializable

/**
 * Created  on 2023-09-20,8:24.
 */
@Serializable
data class Project(
    val name:String,
    val arch:ProjectArch,
    val dbBrand: DbBrand,
    var actors: List<String>,
    var entities: MutableList<Entity>,
    var funcs: List<SysFunc>) {

    //优化项目自身
    fun optimize() : Project{

        //为全项目加上系统角色和系统用户表
        entities += Entity("SystemRole","系统权限", mutableListOf())
        entities += Entity("SystemUser","系统用户", mutableListOf(
            Field("id","用户名"),
            Field("pwd","密码"),
            Field("role","权限")
        ))
        //如果实体没有声明属性，那么会自动加上id、name属性（xx编号，xx名称）
        entities = entities.map { entity ->
            if(entity.fields.isEmpty()){
                entity.fields += Field("id",entity.name+"编号")
                entity.fields += Field("name",entity.name+"名称")
            }
            entity
        }.toMutableList()
        //如果实体没有id属性，那么会自动加上id属性（xx编号）
        entities.forEach {entity->
            if(!entity.fields.map { it.id }.contains("id")){
                entity.fields += Field("id","${entity.name}编号")
            }
        }
        //如果系统用户角色没有管理员，那么自动加上管理员
        //如果系统管理员不是最高权限，那么自动设置为最高权限

        //为每个实体添加comment属性（comment：String/nvarchar200）

        return  this
    }

}