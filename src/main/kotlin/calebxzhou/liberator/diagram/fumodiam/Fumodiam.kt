package calebxzhou.liberator.diagram.fumodiam

import calebxzhou.getResource
import calebxzhou.liberator.DslInstantiable
import calebxzhou.liberator.LiberatorException
import calebxzhou.liberator.diagram.*
import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace
import io.ktor.server.application.*
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Rectangle
import java.awt.geom.Line2D
import java.awt.geom.Point2D
import java.awt.geom.Rectangle2D

data class Module(val name:String,val funcs:List<String>)
data class Fumodiam(val pjName: String, val modules: List<Module>, val unifyFuncHeight: Boolean){
    companion object : DslInstantiable<Fumodiam>{
         override fun fromDsl(dsl: String): Fumodiam {
            val rows = dsl.splitByReturn()
            val pjName = rows.removeFirst()
            val modules = arrayListOf<Module>()
            var unifyFuncHeight = false
            for (row in rows) {
                if(row.contains("@功能统一高度")){
                    unifyFuncHeight = true
                    continue
                }
                val words = row.splitBySpace()
                if(words.size<4){
                    throw LiberatorException("每个模块至少3个功能")
                }
                val moduleName = words.removeFirst()
                modules += Module(moduleName,words)
            }
            return Fumodiam(pjName,modules,unifyFuncHeight)
        }
    }


    private var x = START_X
    private val diam = DiagramDrawer()
    fun drawPicture(): ByteArray {
        drawFunctions()
        diam.done()
        return diam.data
    }
    //每个模块 竖线所在的起始点
    val moduleVlineStartPoints = arrayListOf<Point2D>()
    //名字最长的那个功能的高度
    val longestFuncHeight = modules.flatMap { it.funcs }.maxBy { it.length }.length* (FONT_SIZE + 10 ) + BASE_PADDING * 2
    // 画功能
    private fun drawFunctions() {
         //画每个模块
        for ((moduleName, functions) in modules) {
            //每个功能 竖线所在的起始点
            val vlineStartPoints = arrayListOf<Point2D>()
            val functionStartX = x

            //画每个功能
            for (func in functions) {
                drawFunction(func)
            }
            //画大横线，从第一个竖线画到最后一个竖线
            diam.drawLine(vlineStartPoints.first(),vlineStartPoints.last())
            val functionEndX = x
            val functionCenterX = (functionEndX + functionStartX)/2
            //画模块名
            val moduleStartX = functionCenterX - diam.getTextWidth(moduleName)/2 - BASE_PADDING *2 + 5
            val moduleRect = diam.drawTextWithRect(moduleName,
                moduleStartX,
                170, BASE_PADDING, BASE_PADDING
            )
            //模块顶部中心点
            val moduleTopCenterPoint = Point2D.Double(moduleRect.centerX,moduleRect.minY)
            val moduleVlineStartPoint = Point2D.Double(moduleRect.centerX,moduleRect.minY - 35)
            //模块底部中心点
            val moduleButtomCenterPoint = Point2D.Double(moduleRect.centerX,moduleRect.maxY)
            //画模块名 到 所有功能大横线 的竖线
            diam.drawLine(moduleButtomCenterPoint,Point2D.Double(moduleRect.centerX,moduleRect.maxY + 34))
            //画模块名 到 项目名称大横线 的竖线
            diam.drawLine(moduleVlineStartPoint,moduleTopCenterPoint)
            moduleVlineStartPoints += moduleVlineStartPoint
        }

        val moduleVline1P = moduleVlineStartPoints.first()
        val moduleVlineLP = moduleVlineStartPoints.last()
        //画大横线，从第一个竖线画到最后一个竖线
        diam.drawLine(moduleVline1P, moduleVlineLP)
        val allModuleCenterX = (moduleVline1P.x + moduleVlineLP.x) / 2
        val pjStartX = allModuleCenterX - diam.getTextWidth(pjName)/2 - BASE_PADDING *2 + 5
        //画项目名称
        val rect = diam.drawTextWithRect(pjName,
            pjStartX.toInt(),
            20, BASE_PADDING, BASE_PADDING
        )
        //画大横线 到 项目名称 的竖线
        val pjCenterX = rect.centerX
        diam.drawLine(Point2D.Double(pjCenterX,rect.maxY),Point2D.Double(pjCenterX,rect.maxY+48))
    }

    fun drawFunction(func: String){
        //去掉功能名的两端空格
        val functionName = func.trim()
        //画每一个功能名称
        val rect = if(unifyFuncHeight)
            diam.drawTextWithRectWH(functionName,x,300, BASE_PADDING, BASE_PADDING,
                FONT_SIZE + BASE_PADDING * 2,longestFuncHeight,true)
        else
            diam.drawTextWithRect(functionName, x , 300, BASE_PADDING, BASE_PADDING,true)
        x += rect.width.toInt() + 20
        //画线,每个功能的竖线
        val lineX = rect.centerX
        val lineStartPoint = Point2D.Double(lineX,rect.minY - 30)
        val lineEndPoint = Point2D.Double(lineX,rect.minY)
        diam.drawLine(lineStartPoint,lineEndPoint)
        vlineStartPoints += lineStartPoint
    }

}

