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
        val usrGroups = mutableListOf<String>()
        val entities = mutableListOf<MutableList<String>>()
        for (node in rootNode.nexts) {
            when(node.value){
                USR_GROUP -> {
                    usrGroups.addAll(node.nexts.map { it.value?.literal ?: throw SemanticException("用户权限${it}不可以出现空字符") })
                }
                ENTITY_DEF -> {
                    node.nexts.fold(mutableListOf(mutableListOf<String>())) { acc, s ->
                        if (s.value == SeparatorToken.RET) {
                            acc.add(mutableListOf())
                        } else {
                            acc.last().add(s.value?.literal?: throw SemanticException("实体${s}不可以出现空字符"))
                        }
                        acc
                    }.run { entities.addAll(this) }
                }
                FUNC_DEF -> {

                }
                else ->{}
            }
        }
        //功能定义的权限要求，在用户权限里必须存在

        //功能定义的权限要求，下面的实体，在实体列表里必须存在

        //功能定义的权限要求，下面的实体，至少要有增删改查功能之一
    }
}