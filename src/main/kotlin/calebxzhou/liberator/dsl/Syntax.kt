package calebxzhou.liberator.dsl

import calebxzhou.liberator.dsl.KeywordToken.*
import calebxzhou.liberator.dsl.SeparatorToken.*
import calebxzhou.liberator.splitList
import calebxzhou.liberator.takeBetween
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
            if (token == RET)
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
    private val rootNode = Node<Token>()

    private var currentKeyNode = Node<Token>()

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
            if (skipTokenIteration)
                continue
            if (attachingKeyNode) {
                if (token != RET)
                    currentKeyNode += Node(token)
            }
            if (attachingKeyNode && token == RET) {
                rootNode += currentKeyNode
                attachingKeyNode = false

            }

        }
        return rootNode
    }

    //处理实体定义部分
    private fun handleEntityDef(entityDefNode: Node<Token>, tokens: List<Token>) {
        val entitiesNodes = mutableListOf<Node<Token>>()
        //dsl代码每一行都是一个实体，所以按照\n分割实体
        tokens
            //取“实体定义”到“功能定义”之间的所有token
            .takeBetween(ENTITY_DEF, FUNC_DEF)
            //按照换行符分割实体+字段列表
            .splitList(RET)
            //去掉空列表
            .filter { it.isNotEmpty() }
            .forEachIndexed { _, tokensOf1Entity ->
                //实体 [+英文名]
                val entityNode = Node(tokensOf1Entity.removeFirst())
                    .also { it += Node(tokensOf1Entity.removeFirst()) }
                var fieldNode: Node<Token> = Node()
                for (token in tokensOf1Entity) {
                    if (token is ChineseToken) {
                        fieldNode = Node(token)
                        entityNode += fieldNode
                    } else {
                        fieldNode += Node(token)
                    }
                }
                entitiesNodes += entityNode
            }

        entityDefNode += entitiesNodes
        rootNode += entityDefNode
        attachingKeyNode = false
        skipTokenIteration = true
    }

    private fun handleFuncDef(funcDefNode: Node<Token>, tokens: List<Token>) {
        val usersNodes = mutableListOf<Node<Token>>()
        tokens
            .takeBetween(FUNC_DEF, null)
            //按照"权限要求"分割实体+字段列表
            .splitList(PERM_REQ)
            //去掉空列表和只有换行符的列表
            .filter { it.size > 1 }
            .forEachIndexed { _, tokensOf1User ->
                if (tokensOf1User.firstOrNull() == RET) {
                    tokensOf1User.removeAt(0)
                }
                val userNode = Node(tokensOf1User.removeFirst())
                //按照换行符分割用户下属每个实体
                tokensOf1User.splitList(RET).forEach { oneEntityTokens ->
                    val entityToken = oneEntityTokens.removeFirstOrNull() ?: return@forEach
                    val entityNode = Node(entityToken)
                    oneEntityTokens.map { Node(it) }.forEach { entityNode += it }
                    userNode += entityNode
                }

                usersNodes += userNode
            }
        funcDefNode += usersNodes
        rootNode += funcDefNode
        attachingKeyNode = false
        skipTokenIteration = true
    }


}