package calebxzhou.liberator.dsl

import calebxzhou.liberator.dsl.KeywordToken.*
import calebxzhou.liberator.model.*

class CodeGen(val rootNode: Node<Token>) {
    fun makeProject():Project{
        var pjName = ""
        var dbBrand :Token? = null
        var usrGroups = listOf<String>()
        val entities = mutableListOf<Entity>()
        val funcs = mutableListOf<SysFunc>()

        for (node in rootNode.nexts) {
            when(node.value){
                PJ_NAME -> pjName = node.nexts.first().value?.literal?:""
                DB_BRAND -> dbBrand = node.nexts.first().value
                USR_GROUP -> usrGroups = node.nexts.map { it.value?.literal?:"" }.toList()
                ENTITY_DEF -> {
                    node.nexts.forEach { entityNode->
                        val name = entityNode.value?.literal?:""
                        val id = entityNode.nexts.removeFirst().value?.literal?:""
                        val fields = entityNode.nexts.map { Field(it.nexts.first().value?.literal?:"",it.value?.literal?:"",PrimitiveDataType.STRING) }.toMutableList()
                        entities += Entity(id,name,fields)
                    }
                }
                FUNC_DEF ->{
                    node.nexts.forEach { funcNode ->
                        val role = funcNode.value?.literal?:""
                        val func = SysFunc(role, mutableMapOf())
                        funcNode.nexts.forEach { entityNode ->
                            val entity = entityNode.value?.literal?:""
                            val perms = entityNode.nexts.map { when(it.value){
                                SELECT -> SysFuncPermission.SELECT
                                INSERT -> SysFuncPermission.INSERT
                                DELETE -> SysFuncPermission.DELETE
                                UPDATE -> SysFuncPermission.UPDATE
                                else -> SysFuncPermission.SELECT
                            } }.toList()
                            func.entityPerm += entity to perms
                        }
                        funcs += func
                    }
                }
                else ->{}
            }
        }
        return  Project(pjName,
            ProjectArch.SSM,
            when(dbBrand){
                MYSQL -> DbBrand.MYSQL
                MSSQL -> DbBrand.MSSQL
                else -> DbBrand.MYSQL
            },
            usrGroups,
            entities,
            funcs).optimize()
    }


}