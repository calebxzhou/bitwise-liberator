package calebxzhou.liberator.diagram.actogram

import calebxzhou.liberator.DslInstantiable
import calebxzhou.liberator.diagram.*
import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace
import java.awt.geom.Point2D

//
data class ActFunc(val actor: String, val funcs:List<String>)
data class Actogram(val pjName:String,val acts: List<ActFunc>) :DiagramDrawable{
    private val diam = DiagramDrawer()
    companion object : DslInstantiable<Actogram>{
        override fun fromDsl(dsl: String): Actogram {
            val rows = dsl.splitByReturn()
            val pjName = rows.removeFirst()
            val acts = arrayListOf<ActFunc>()
            for (row in rows) {
                val words = row.splitBySpace()
                val actor = words.removeFirst()
                acts += ActFunc(actor,words)
            }
            return Actogram(pjName,acts)
        }
    }
    override fun draw(): ByteArray {
        // 所有的功能画在中间 一竖列    产生map：功能名 to point（连线用）
        drawFunctions()
        // 画2~6个角色
        /*
         2:     3:      4:      5:      6:
         x  x   1   x   1   3   1   4   1   2
         1  2   x   3   x   x   2   x   3   4
         x  x   2   x   2   4   3   5   5   6
         */
        drawActors()
        //连线
        drawLine()
        //功能画框
        drawFrame()
        diam.done()
        return diam.data
    }
    private fun drawFunctions() : Map<String,Point2D> {
        val funcPos = hashMapOf<String,Point2D>()
        val funcs = acts.flatMap { it.funcs }
        val x = WIDTH/3
        var y = 200
        for (funcName in funcs) {
            //已经有的功能就不画了
            if(funcPos.containsKey(funcName))
                continue
            diam.drawTextWithOral(funcName,x,y)
            y+=150
            funcPos += funcName to pointOf(x,y)

        }
        return funcPos
    }

    private fun drawFrame() {

    }

    private fun drawLine() {

    }

    private fun drawActors() {

    }


}