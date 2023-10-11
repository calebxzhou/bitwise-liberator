package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.KeywordToken.*
import mu.KotlinLogging

/**
 * Created  on 2023-09-28,21:59.
 */
class Syntax(val tokens: List<Token>) {
    private val logger = KotlinLogging.logger {}

    //语法检查状态
    private enum class CheckState {
        INIT,

        //token后面必须是中文
        TOKEN_AFTER_CHINESE,

        //token后面必须是ID
        TOKEN_AFTER_ID,

        //token后面数据库品牌限定
        TOKEN_AFTER_DB_BRAND,

        //token后面必须是分隔符(换行 等)
        TOKEN_AFTER_SEPARATOR,

        //token后面必须是关键字
        TOKEN_AFTER_KEYWORD,

    }

    //语法分析
    fun analyze(): Node<Token> {
        check()
        return genParseTree()
    }


    //语法检查
    private fun check() {
        var state = CheckState.INIT
        var lineNum = 0
        for (token in tokens) {
            if (token == SeparatorToken.RET)
                ++lineNum
            when (state) {
                CheckState.TOKEN_AFTER_CHINESE -> {
                    if (token !is ChineseToken) {
                        throw SyntaxException(lineNum, "关键字的后面必须是中文，不允许是“${token.literal}”")
                    }
                }

                CheckState.TOKEN_AFTER_DB_BRAND -> {
                    if (token != MYSQL && token != MSSQL) {
                        throw SyntaxException(
                            lineNum,
                            "错误的数据库品牌“${token.literal}”! 数据库品牌只能是mysql或者sqlserver"
                        )
                    }
                }

                CheckState.TOKEN_AFTER_KEYWORD -> {
                    if (token !is KeywordToken) {
                        throw SyntaxException(lineNum, "“${token.literal}”后面必须是关键字！")
                    }
                }

                else -> {}
            }
            when (token) {
                //项目名称，用户权限，权限要求后面必须是中文
                PJ_NAME, USR_GROUP, PERM_REQ -> {
                    state = CheckState.TOKEN_AFTER_CHINESE
                    continue
                }
                //数据库品牌限制
                DB_BRAND -> {
                    state = CheckState.TOKEN_AFTER_DB_BRAND
                    continue
                }
                //实体定义 功能定义后面必须换行
                ENTITY_DEF, FUNC_DEF -> {
                    state = CheckState.TOKEN_AFTER_SEPARATOR
                    continue
                }
                //全部实体 后面必须是关键字
                ALL_ENTITY -> {
                    state = CheckState.TOKEN_AFTER_KEYWORD
                }

                else -> {
                    state = CheckState.INIT
                }
            }


        }

    }


    //根节点
    private val rootNode = Node<Token>(null)

    private var currentKeyNode = Node<Token>(null)

    private var attachingKeyNode = false

    private var skipTokenIteration = false
    //语法树
    private fun genParseTree(): Node<Token> {
        for (token in tokens) {

            //key节点：项目名称 数据库品牌 用户权限 实体定义 功能定义
            if (token == PJ_NAME || token == DB_BRAND || token == USR_GROUP) {
                currentKeyNode = Node(token)
                attachingKeyNode = true
                continue
            }
            if (token == ENTITY_DEF) {
                currentKeyNode = Node(token)
                attachingKeyNode = true
                handleEntityDef(currentKeyNode, tokens)
                continue
            }
            if (token == FUNC_DEF) {
                currentKeyNode = Node(token)
                attachingKeyNode = true
                handleFuncDef(currentKeyNode, tokens)
                continue
            }
            //跳过循环
            if(skipTokenIteration)
                continue
            if(attachingKeyNode){
                if(token != SeparatorToken.RET)
                    currentKeyNode += Node(token)
            }
            if (attachingKeyNode && token == SeparatorToken.RET) {
                rootNode += currentKeyNode
                attachingKeyNode = false

            }

        }
        rootNode += currentKeyNode
        return rootNode
    }

    //处理实体定义部分
    private fun handleEntityDef(entityDefNode: Node<Token>, tokens: List<Token>) {
        val entitiesNodes = mutableListOf<Node<Token>>()
        //dsl代码每一行都是一个实体，所以按照\n分割实体
        tokens
            .dropWhile { it != ENTITY_DEF }
            .drop(1)
            .takeWhile { it != FUNC_DEF }
            //按照换行符分割实体+字段列表
            .fold(mutableListOf(mutableListOf<Token>())) { acc, s ->
                if (s == SeparatorToken.RET)
                    acc.add(mutableListOf())
                acc.last().add(s)
                acc
            }.forEachIndexed { _, tokensOf1Entity ->
                if (tokensOf1Entity.firstOrNull() == SeparatorToken.RET) {
                    tokensOf1Entity.removeAt(0)
                }
                if (tokensOf1Entity.isEmpty()) {
                    return@forEachIndexed
                }
                val entityNode = Node(tokensOf1Entity.first())
                var prevChineseNode: Node<Token> = Node(null)
                for ((index, token) in tokensOf1Entity.withIndex()) {
                    when (index) {
                        //实体中文名
                        0 -> continue
                        //实体英文名
                        1 -> entityNode += Node(token)
                        else -> {
                            if (token is ChineseToken) {
                                prevChineseNode = Node(token)
                                entityNode += prevChineseNode
                            } else {
                                prevChineseNode += Node(token)
                            }
                        }
                    }
                }
                entitiesNodes += entityNode
            }

        entityDefNode.nexts.addAll(entitiesNodes)
        rootNode += entityDefNode
        attachingKeyNode = false
        skipTokenIteration = true
    }

    private fun handleFuncDef(funcDefNode: Node<Token>, tokens: List<Token>) {
        val usersNodes = mutableListOf<Node<Token>>()
        tokens
            .dropWhile { it != FUNC_DEF }
            .drop(1)
            //按照"权限要求"分割实体+字段列表
            .fold(mutableListOf(mutableListOf<Token>())) { acc, s ->
                if (s == PERM_REQ)
                    acc.add(mutableListOf())
                acc.last().add(s)
                acc
            }.forEachIndexed { i, tokensOf1User ->
                if (tokensOf1User.firstOrNull() == SeparatorToken.RET
                    || tokensOf1User.firstOrNull() == PERM_REQ) {
                    tokensOf1User.removeAt(0)
                }
                if (tokensOf1User.isEmpty()) {
                    return@forEachIndexed
                }
                val userNode = Node(tokensOf1User.first())
                var entityNode :Node<Token> = Node(null)
                tokensOf1User.forEach { token ->

                }
                usersNodes += userNode
            }
        funcDefNode.nexts.addAll(usersNodes)
        rootNode += funcDefNode
        attachingKeyNode = false
        skipTokenIteration = true
    }


}