package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.KeywordToken.*

/**
 * Created  on 2023-10-01,7:43.
 */
object Semantic {

    //语义分析
    fun analyze(rootNode: Node<Token>){
        check(rootNode)
    }

    //检查
    private fun check(rootNode: Node<Token>) {
        val usrGroups = mutableListOf<Token>()
        val entities = mutableListOf<Token>()
        for (node in rootNode.nexts) {
            if (node.value == USR_GROUP) {
                usrGroups.addAll(node.nexts.map { it.value?: throw SemanticException("用户权限${it}不可以出现空字符") })
                continue
            }
            if (node.value == ENTITY_DEF) {
                entities.addAll(node.nexts.map { it.value?: throw SemanticException("实体${it}不可以出现空字符") })
                continue
            }
            if (node.value == FUNC_DEF) {
                //功能定义的权限要求，在用户权限里必须存在
                val funcDefUsers = node.nexts.map { it.value }.toSet()
                if (!usrGroups.containsAll(funcDefUsers)) {
                    throw SemanticException("实体${funcDefUsers subtract usrGroups.toSet()}不存在") }
                }
            }
        }
    }
