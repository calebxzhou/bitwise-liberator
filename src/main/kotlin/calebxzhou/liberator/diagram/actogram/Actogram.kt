package calebxzhou.liberator.diagram.actogram

import calebxzhou.liberator.DslInstantiable
import calebxzhou.liberator.diagram.*
import calebxzhou.liberator.isEven
import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace
import java.awt.geom.Point2D
import java.util.SortedMap

//
data class ActorFunc(val actorName: String, val funcNames:List<String>)
data class Actogram(val pjName:String,val actors: List<ActorFunc>) :DiagramDrawable{
    private val diam = DiagramPainter()
    companion object : DslInstantiable<Actogram>{
        override fun fromDsl(dsl: String): Actogram {
            if(dsl.isBlank())
                return Actogram("", arrayListOf())
            val rows = dsl.splitByReturn()
            val pjName = rows.removeFirst()
            val acts = arrayListOf<ActorFunc>()
            for (row in rows) {
                val words = row.splitBySpace()
                val actor = words.removeFirst()
                acts += ActorFunc(actor,words)
            }
            return Actogram(pjName,acts)
        }
    }

    //全部功能
    val funcs = actors.flatMap { it.funcNames }
    val startY = 200
    override fun draw(): ByteArray {
        // 所有的功能画在中间 一竖列    产生map：功能名 to point（连线用）
        try{
            val funcPoses = drawFunctions()
            val actorPoses = drawActors(funcPoses)
            //连线
            drawLine(funcPoses,actorPoses)
            //功能画框
            drawFrame(funcPoses)
        }catch (e: NoSuchElementException){
            diam.drawString("输入不能为空",100,100);
        }

        diam.done()
        return diam.data
    }
    private fun drawFunctions() : Map<String,EllipseShape> {
        var x = WIDTH/3
        var y = startY
        val funcPoses = linkedMapOf<String,EllipseShape>()
        for ((index, funcName) in funcs.withIndex()) {
            //已经有的功能就不画了
            if(funcPoses.containsKey(funcName))
                continue
            val shape = EllipseShape.draw(diam,funcName, centerTextPosOf(diam,funcName,x),y)
            y+= 110
            funcPoses += funcName to shape
        }
        return funcPoses
    }

    //入功能位置 出角色名to位置
    private fun drawActors(funcPoses : Map<String,EllipseShape>) : Map<String, ActorShape>{
        val actorNamePoints= hashMapOf<String, ActorShape>()
        val leftX = WIDTH/5
        val rightX = WIDTH/2
        //  最后一个功能Y
        val endY = funcPoses.maxBy { it.value.yDown.y }.value.yDown.y

        //确定角色点
        val actorPoints = getActorDrawPoints(actors.size,leftX, rightX, endY.toInt())
        for ((index, act) in actors.withIndex()) {
            actorPoints[index].let {
                val actorShape = ActorShape.drawAtCenter(diam,act.actorName,it.x.toInt(),it.y.toInt())
                actorNamePoints += act.actorName to actorShape
            }
        }
        return  actorNamePoints
    }
    private fun drawLine(funcPoses: Map<String, EllipseShape>, actorPoses: Map<String, ActorShape>) {
        for (actorFunc in actors) {
            val actorShape = actorPoses[actorFunc.actorName]?:continue
            for (funcName in actorFunc.funcNames) {
                val funcShape = funcPoses[funcName]?:continue
                //人在功能左边
                if(actorShape.armR.x < funcShape.xLeft.x)
                    diam.drawArrowLine(actorShape.armR,funcShape.xLeft,true)
                else //人在功能右边
                    diam.drawArrowLine(actorShape.armL,funcShape.xRight,true)
            }
        }
    }

    //画最后的外框
    private fun drawFrame(funcPoses: Map<String, EllipseShape>) {
        val firstFunc = funcPoses.entries.first().value
        val lastFunc = funcPoses.entries.last().value
        val x1 = firstFunc.xLeft.x - 250
        val x2 = lastFunc.xRight.x + 250
        val y1 = 50
        val y2 = lastFunc.yDown.y+200
        val width = x2-x1
        val height = y2-y1
        diam.drawString(pjName, centerTextPosOf(diam,pjName, x1.toInt(),x2.toInt()),80)
        diam.g.drawRect(x1.toInt(), y1,width.toInt(),height.toInt())
    }


    /*
                画角色的位置
                     2:         3:          4:          5:          6:
                     x  x       x   2       1   3       1   2       1   2
                     1  2       1   x       x   x       x   3       3   4
                     x  x       x   3       2   4       5   4       5   6

                     */
    private fun getActorDrawPoints(actorAmount: Int,leftX :Int, rightX: Int, endY : Int) : List<Point2D> {
        val actorDrawPoints = arrayListOf<Point2D>()
        when(actorAmount){
            2 -> {
                actorDrawPoints += pointOf(leftX,centerPosOf(startY,endY))
                actorDrawPoints += pointOf(rightX, centerPosOf(startY,endY))
            }
            3 -> {
                actorDrawPoints += pointOf(leftX,centerPosOf(startY,endY))
                actorDrawPoints += pointOf(rightX,startY)
                actorDrawPoints += pointOf(rightX,endY)
            }
            4 -> {
                actorDrawPoints += pointOf(leftX,startY)
                actorDrawPoints += pointOf(rightX,startY)
                actorDrawPoints += pointOf(leftX,endY)
                actorDrawPoints += pointOf(rightX,endY)
            }
            5 -> {
                actorDrawPoints += pointOf(leftX,startY)
                actorDrawPoints += pointOf(rightX,startY)
                actorDrawPoints += pointOf(leftX,endY)
                actorDrawPoints += pointOf(rightX,endY)
                actorDrawPoints += pointOf(rightX,centerPosOf(startY,endY))
            }
            6 -> {
                actorDrawPoints += pointOf(leftX,startY)
                actorDrawPoints += pointOf(rightX,startY)
                actorDrawPoints += pointOf(leftX,endY)
                actorDrawPoints += pointOf(rightX,endY)
                actorDrawPoints += pointOf(leftX,centerPosOf(startY,endY))
                actorDrawPoints += pointOf(rightX,centerPosOf(startY,endY))
            }
            else ->{
                val yStep = (endY - startY)/actorAmount
                var y = startY
                for (index in 1..actorAmount) {
                    if(index.isEven())
                        actorDrawPoints += pointOf(rightX,y)
                    else
                        actorDrawPoints += pointOf(leftX,y)
                    y += yStep
                }
            }
        }
        return actorDrawPoints
    }


}