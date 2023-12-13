package calebxzhou.liberator.ssm

import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace
import calebxzhou.liberator.templateOf
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.ByteArrayOutputStream
import java.io.StringWriter
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * Created  on 2023-12-05,15:55.
 */


const val JAVA_OUT_PATH = "src/main/java"
const val SSM_OUT_PATH = "$JAVA_OUT_PATH/com/ssm"
const val WEB_OUT_PATH = "src/main/webapp"
const val WEB_INF_OUT_PATH = "$WEB_OUT_PATH/WEB-INF"



val logger = KotlinLogging.logger{}


data class SsmProject(
    val pjName:String,
    private val entityMap: LinkedHashMap<String,Entity> = linkedMapOf(),
    private val actorMap: LinkedHashMap<String,Actor> = linkedMapOf(),
)  {

    val entities = entityMap.values
    val actors = actorMap.values
    //添加实体
    operator fun plusAssign(entity: Entity){
        entityMap += entity.id to entity
    }
    operator fun plusAssign(actor: Actor){
        actorMap += actor.id to actor
    }
    operator fun get(entityId: String) : Entity? = entityMap[entityId]
    //生成全部实体的代码（实体id to 代码）
    fun genCodeForEntities():Map<Entity,List<CodeGen>>{
        val map = hashMapOf<Entity,List<CodeGen>>()
        for (entity in entities) {
            val code = arrayListOf<CodeGen>()
            CodeType.entries.filter { !it.forGlobal }
                .forEach { codeType ->
                    StringWriter().use { out->
                        templateOf(codeType.templatePath)
                            .process(mapOf("entity" to entity,"project" to this),out)
                        code += CodeGen(codeType,out.toString())
                    }
            }
            map += entity to code
        }
        return map
    }
    //生成整个项目的代码
    fun genCodeForProject():Map<CodeType,CodeGen>{
        val map = hashMapOf<CodeType,CodeGen>()
        CodeType.entries.filter { it.forGlobal }
            .forEach { codeType ->
                StringWriter().use { out->
                    templateOf(codeType.templatePath)
                        .process(mapOf("project" to this),out)
                    map += codeType to CodeGen(codeType,out.toString())
                }
            }
        return map
    }
    //生成全部代码并打包
    fun genCodeZip() : ByteArray{
        val bytes = ByteArrayOutputStream()
        val zipOut = ZipOutputStream(bytes)
        genCodeForEntities().forEach { (entity, codes) ->
            codes.forEach { code ->
                if(!code.codeType.forGlobal){
                    zipOut.putNextEntry(ZipEntry(code.codeType.getOutPath(entity.capId)))
                    zipOut.write(code.code.toByteArray())
                    zipOut.closeEntry()
                }
            }
        }
        genCodeForProject().forEach { (type, gen) ->
            zipOut.putNextEntry(ZipEntry(type.getOutPath("")))
            logger.info { "正在写入文件${type.name}" }
            zipOut.write(gen.code.toByteArray())
            zipOut.closeEntry()
        }

        zipOut.close()
        return  bytes.toByteArray()
    }
    companion object{
        //从dsl代码创建项目
        fun fromDsl(pjName:String?, entityDsl:String?, permDsl:String?):SsmProject{
            if(pjName.isNullOrBlank() || entityDsl.isNullOrBlank() || permDsl.isNullOrBlank())
                throw SsmException("输入不能为空")
            //项目
            val project = SsmProject(pjName)
            val entityDsl = """
                角色role
                用户systemuser 用户名uname 密码pwd 角色
                """.trimIndent()+"\n"+entityDsl
            logger.info { entityDsl }
            initEntitiesFromDsl(project,entityDsl)
            handlePermDsl(project, permDsl)
            printProject(project)
            return project
        }

        private fun printProject(project: SsmProject) {
            val entities = project.entities.map { entity -> "\n${entity.name}${entity.id}: ${entity.fields.map { field -> "${field.name}${field.id}"}.joinToString(" ")}" }
            val actors = project.actors.map { actor -> "\n${actor.id}-${actor.perms.map { entry -> "\n${entry.key.name}${entry.key.id}-${entry.value}" }.joinToString  (" ")}" }
            logger.info { """
                ${project.pjName}
                $entities
                $actors
            """.trimIndent() }
        }

        private fun initEntitiesFromDsl(project: SsmProject, dsl:String){
            for (entityLine in dsl.splitByReturn()) {
                val fieldTokens = entityLine.splitBySpace().toMutableList()
                //每行第一个token是实体
                val entity = IdNameBase.fromToken(fieldTokens.removeFirst()).run {
                    Entity(id,name)
                }
                //先给实体加上主键（xxx id，xxx编号）
                val idField = Field("${entity.id}Id", "${entity.name}编号", entity.id).apply { type = Field.ID_JTYPE }
                entity += idField
                //再添加其他字段
                for (fieldToken in fieldTokens) {
                    val idname = IdNameBase.fromToken(fieldToken)
                    val refEntity = project.entities.find { it.name == idname.name }
                    val field = if (refEntity != null){
                        Field(entity.id +"_"+refEntity.primaryKey.id,idname.name,entity.id).apply { type = Field.ID_JTYPE }.also {
                            entity.fieldRefMap += it to refEntity
                        }

                    } else{
                        Field(idname.id,idname.name,entity.id)
                    }
                    entity += field
                }
                //若没有其他字段，加上"xxx名称"字段
                if(fieldTokens.isEmpty()){
                    entity += Field("${entity.id}Name",entity.name+"名称",entity.id)
                }
                project += entity
            }
        }

        private fun handlePermDsl(project: SsmProject, dsl:String): List<Actor>{
            val actors = arrayListOf<Actor>()
            //添加管理员
            actors += Actor("系统管理员").apply {
                project.entities.forEach { perms += it to Permission.all }
            }
            for (actorLine in dsl.splitByReturn()) {
                val actorTokens = actorLine.splitBySpace().toMutableList()
                val actor = Actor(actorTokens.removeFirst())
                for (actorToken in actorTokens) {
                    val idname = IdNameBase.fromToken(actorToken)
                    val entityName = idname.name
                    val perms = Permission.match(idname.id)
                    val entity = project.entities.find { it.name==entityName }
                        ?:throw SsmException("无效的权限设定！找不到实体“$entityName”")
                    actor.perms += entity to perms
                }
                project += actor
            }

            return actors
        }

    }
}
