package calebxzhou.codenliberate.dsl

import calebxzhou.codenliberate.dsl.KeywordToken.*

/**
 * Created  on 2023-09-28,21:59.
 */
class Syntax(val tokens: List<Token>) {
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
        var lineNum =0
        for (token in tokens) {
            if(token == SeparatorToken.RET)
                ++lineNum
            when (state) {
                CheckState.TOKEN_AFTER_CHINESE -> {
                    if (token !is ChineseToken) {
                        throw SyntaxException(lineNum,"关键字的后面必须是中文，不允许是“${token.literal}”")
                    }
                }

                CheckState.TOKEN_AFTER_DB_BRAND -> {
                    if (token != MYSQL && token != MSSQL) {
                        throw SyntaxException(lineNum,"错误的数据库品牌“${token.literal}”! 数据库品牌只能是mysql或者sqlserver")
                    }
                }

                CheckState.TOKEN_AFTER_KEYWORD -> {
                    if (token !is KeywordToken) {
                        throw SyntaxException(lineNum,"“${token.literal}”后面必须是关键字！")
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
    private enum class ParsingState{
        INIT,
        //附加到key节点上
        ATTACH_KEY_NODE,
    }
    //语法树
    private fun genParseTree(): Node<Token> {
        val rootNode = Node<Token>(null)
        var currentKeyNode: Node<Token> = rootNode
        //主状态 (默认/+key节点)
        var mainState = ParsingState.INIT

        //是否将换行（RET）加到节点里，实体定义和功能定义需要加，方便语义分析
        var addRetToNode = false
        for (token in tokens) {
            //匹配token内容
            when(token) {
                //key节点：项目名称 数据库品牌 用户权限  实体定义 功能定义
                PJ_NAME,DB_BRAND,USR_GROUP,ENTITY_DEF,FUNC_DEF -> {
                    addRetToNode = token == ENTITY_DEF || token == FUNC_DEF
                    mainState = ParsingState.ATTACH_KEY_NODE
                    if(currentKeyNode != rootNode)
                        rootNode += currentKeyNode
                    currentKeyNode = Node(token)
                    continue
                }
                else ->{

                }
            }
            when(mainState){
                ParsingState.ATTACH_KEY_NODE ->{
                    if(token == SeparatorToken.RET){
                        if(addRetToNode)
                            currentKeyNode += Node(token)
                        else {
                            //不把换行符加到节点里
                        }
                    }else{
                        currentKeyNode += Node(token)
                    }
                }
                else -> {}
            }

        }
        rootNode += currentKeyNode
        return rootNode
    }

}