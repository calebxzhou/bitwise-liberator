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
    private val diam = DiagramDrawer()
    companion object : DslInstantiable<Actogram>{
        override fun fromDsl(dsl: String): Actogram {
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

    val funcs = actors.flatMap { it.funcNames }
    val startY = 200
    override fun draw(): ByteArray {
        // 所有的功能画在中间 一竖列    产生map：功能名 to point（连线用）
        val funcPoses = drawFunctions()
        val actorPoses = drawActors(funcPoses)
        //连线
        drawLine(funcPoses,actorPoses)
        //功能画框
        drawFrame()
        diam.done()
        return diam.data
    }
    private fun drawFunctions() : Map<String,Point2D> {
        val x = WIDTH/3
        var y = startY
        val funcPoses = hashMapOf<String,Point2D>()
        //先画共有功能
        for (funcName in funcs) {
            //已经有的功能就不画了
            if(funcPoses.containsKey(funcName))
                continue
            diam.drawTextWithOral(funcName,x,y)
            y+=150
            funcPoses += funcName to pointOf(x,y)
        }
        return funcPoses
    }

    //入功能位置 出角色名to位置
    private fun drawActors(funcPoses : Map<String,Point2D>) : Map<String,Point2D>{
        val leftX = WIDTH/5
        val rightX = WIDTH/2
        //  最后一个功能Y
        val endY = funcPoses.maxBy { it.value.y }.value.y.toInt()
        val actorNamePoints= hashMapOf<String,Point2D>()
        //确定角色点
        val actorPoints = getActorDrawPoints(actors.size,leftX, rightX, endY)
        for ((index, act) in actors.withIndex()) {
            actorPoints[index].let {
                diam.drawActor(act.actorName,it.x.toInt(),it.y.toInt())
                actorNamePoints += act.actorName to it
            }
        }
        return  actorNamePoints
    }
    private fun drawLine(funcPoses: Map<String, Point2D>, actorPoses: Map<String, Point2D>) {
        for (actorFunc in actors) {
            val p1 = actorPoses[actorFunc.actorName]?:continue
            for (funcName in actorFunc.funcNames) {
                val p2 = funcPoses[funcName]?:continue
                diam.drawLine(p1,p2)
            }
        }
    }
    private fun drawFrame() {

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
                actorDrawPoints += pointOf(leftX,centerOf(startY,endY))
                actorDrawPoints += pointOf(rightX, centerOf(startY,endY))
            }
            3 -> {
                actorDrawPoints += pointOf(leftX,centerOf(startY,endY))
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
                actorDrawPoints += pointOf(rightX,centerOf(startY,endY))
            }
            6 -> {
                actorDrawPoints += pointOf(leftX,startY)
                actorDrawPoints += pointOf(rightX,startY)
                actorDrawPoints += pointOf(leftX,endY)
                actorDrawPoints += pointOf(rightX,endY)
                actorDrawPoints += pointOf(leftX,centerOf(startY,endY))
                actorDrawPoints += pointOf(rightX,centerOf(startY,endY))
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