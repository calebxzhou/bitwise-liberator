package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.KeywordToken.*

/**
 * Created  on 2023-09-28,21:59.
 */
class Syntax(val tokens: List<Token>) {

    //语法分析
    fun analyze() {
        check()
        genParseTree()
    }

    //规则1：数据库品牌只能是mysql或者sqlserver
    val rule1: (Token) -> Boolean = {it != MYSQL || it != MSSQL}
    private fun check() {
        val tokenList = TokenList(tokens)
        while(tokenList.hasNextToken){

        }
        //关键字：{项目名称 数据库品牌 用户权限 权限要求}的后面必须是文本
        for ((index, token) in tokens.withIndex()) {
            if (token !is KeywordToken) continue
            when (token) {
                PJ_NAME, USR_GROUP, PERM_REQ -> {
                    tokens.getOrNull(index + 1)?.let {
                        if (it !is ChineseToken) {
                            throw SyntaxException("关键字：${token.literal}的后面“${it.literal}”必须是中文")
                        }
                    } ?: throw SyntaxException("关键字：${token.literal}的后面必须要有内容")
                }

                DB_BRAND -> {
                    tokens.getOrNull(index + 1)?.let {
                        if (it != MYSQL || it != MSSQL) {
                            throw SyntaxException("错误的数据库品牌${it.literal}! 数据库品牌只能是mysql或者sqlserver")
                        }
                    } ?: throw SyntaxException("关键字：${token.literal}的后面必须要有内容")

                }

                ENTITY_DEF, FUNC_DEF -> {
                    tokens.getOrNull(index + 1)?.let {
                        if (it != SeparatorToken.LB) {
                            throw SyntaxException("${it.literal}后边必须有分隔符“{”")
                        }
                    } ?: throw SyntaxException("关键字：${token.literal}的后面必须要有内容")
                }

                else -> {}
            }
        }

    }

    private fun genParseTree() {
        val rootNode = Node<Token>(null)
        var currentKeyToken : KeywordToken? = null
        var currentKeyNode : Node<Token>
        /*for(token in tokens){
            if(token is KeywordToken){
                currentKeyToken = token
                currentKeyNode = Node(token)
                continue
            }
            when(currentKeyToken){
                PJ_NAME,DB_BRAND,USR_GROUP ->{
                    currentKeyNode += Node()
                }
                else ->{

                }
            }

        }*/
        /*var i = 0
        while(i < tokens.size){
            val token = tokens[i]
            when (token) {
                //项目名称，数据库品牌后面 直接读取
                PJ_NAME, DB_BRAND -> {
                    val pjdbToken = Node(token)
                    val nextToken = tokens[++i]
                    rootNode += pjdbToken.apply {this += Node(nextToken) }
                }
                // 用户权限，一直读token直到下一个关键字
                USR_GROUP ->{
                    val usrGroupNode = Node(token)
                    do {
                        usrGroupNode += Node(tokens[i + 1])
                        ++i
                    }while (tokens[i + 1] !is KeywordToken)
                    rootNode += usrGroupNode
                }
                //实体定义
                ENTITY_DEF ->{
                    val entityDefNode = Node(token)

                }

            }
        }*/
    }

}