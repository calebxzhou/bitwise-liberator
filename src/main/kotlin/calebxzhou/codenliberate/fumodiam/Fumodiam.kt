package calebxzhou.codenliberate.fumodiam

import calebxzhou.codenliberate.stringMapFirstAsso
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Rectangle
import java.awt.geom.Line2D
import java.awt.geom.Point2D
import java.awt.geom.Rectangle2D

class Fumodiam(private val pjName: String,private val dsl:String){
    companion object{
        const val WIDTH = 3840
        const val HEIGHT = 1080
        const val FONT_SIZE = 30
        const val START_X = 100
        const val BASE_PADDING = 15
    }
    //模块功能定义，并去掉空模块
    //模块1 - 【功能1 功能2 功能3】，模块2 - 【功能4 功能5 功能6 】....
    private val moduleFunction = stringMapFirstAsso(dsl).filter { it.key.isNotBlank() }
    private val g = SVGGraphics2D(WIDTH.toDouble(),HEIGHT.toDouble()).apply { font = Font("SimSun",Font.PLAIN, FONT_SIZE) }
    private val font = g.fontMetrics
    private var x = START_X
    fun drawPicture(): ByteArray {
        drawFunctions()
        /*moduleFunction.forEach { module, functions ->
            drawModule(baseX,800 ,module,functions)
                .also {width ->  baseX += 150 + width }
        }
*/



        g.dispose()
        //TODO 划线
        return g.svgElement.toByteArray()
    }

    // 画功能
    private fun drawFunctions() {
        //每个模块 竖线所在的起始点
        val moduleVlineStartPoints = arrayListOf<Point2D>()
        //画每个模块
        moduleFunction.forEach { (moduleName, functions) ->
            //每个功能 竖线所在的起始点
            val vlineStartPoints = arrayListOf<Point2D>()
            val functionStartX = x
            //画每个功能
            functions.forEach{
                //去掉功能名的两端空格
                val functionName = it.trim()
                //画每一个功能名称
                val rect = drawTextWithRect(functionName, x , 300,15,15,true)
                x += rect.width.toInt() + 20
                //画线,每个功能的竖线
                val lineX = rect.centerX
                val lineStartPoint = Point2D.Double(lineX,rect.minY - 30)
                val lineEndPoint = Point2D.Double(lineX,rect.minY)
                drawLine(lineStartPoint,lineEndPoint)
                vlineStartPoints += lineStartPoint
            }
            //画大横线，从第一个竖线画到最后一个竖线
            drawLine(vlineStartPoints.first(),vlineStartPoints.last())
            val functionEndX = x
            val functionCenterX = (functionEndX + functionStartX)/2
            //画模块名
            val moduleStartX = functionCenterX - font.stringWidth(moduleName)/2 - BASE_PADDING*2 + 5
            val moduleRect = drawTextWithRect(moduleName,
                moduleStartX,
                170, BASE_PADDING, BASE_PADDING)
            //模块顶部中心点
            val moduleTopCenterPoint = Point2D.Double(moduleRect.centerX,moduleRect.minY)
            val moduleVlineStartPoint = Point2D.Double(moduleRect.centerX,moduleRect.minY - 35)
            //模块底部中心点
            val moduleButtomCenterPoint = Point2D.Double(moduleRect.centerX,moduleRect.maxY)
            //画模块名 到 所有功能大横线 的竖线
            drawLine(moduleButtomCenterPoint,Point2D.Double(moduleRect.centerX,moduleRect.maxY + 34))
            //画模块名 到 项目名称大横线 的竖线
            drawLine(moduleVlineStartPoint,moduleTopCenterPoint)
            moduleVlineStartPoints += moduleVlineStartPoint
        }

        val moduleVline1P = moduleVlineStartPoints.first()
        val moduleVlineLP = moduleVlineStartPoints.last()
        //画大横线，从第一个竖线画到最后一个竖线
        drawLine(moduleVline1P, moduleVlineLP)
        val allModuleCenterX = (moduleVline1P.x + moduleVlineLP.x) / 2
        val pjStartX = allModuleCenterX - font.stringWidth(pjName)/2 - BASE_PADDING*2 + 5
        //画项目名称
        val rect = drawTextWithRect(pjName,
            pjStartX.toInt(),
            20, BASE_PADDING, BASE_PADDING)
        //画大横线 到 项目名称 的竖线
        val pjCenterX = rect.centerX
        drawLine(Point2D.Double(pjCenterX,rect.maxY),Point2D.Double(pjCenterX,rect.maxY+48))
    }

    //绘制文本+外框，rotate=true则竖着画
    private fun drawTextWithRect(text:String,x:Int,y:Int,paddingX: Int,paddingY:Int,rotate: Boolean = false) : Rectangle2D{
        val rect : Rectangle2D = if(!rotate){
            g.drawString(text, x, y+ font.ascent)
            Rectangle(x-paddingX,y-paddingY,font.stringWidth(text)+paddingX*2,font.height+paddingY*2)
        }else{
            //旋转true，每个汉字占一行
            val baseH = y + font.ascent
            text.forEachIndexed { index, c ->
                g.drawString("$c", x, baseH + index * 40)
            }
            Rectangle(x-paddingX,y-paddingY, FONT_SIZE + paddingX * 2,text.length * (FONT_SIZE + 10 ) + paddingY * 2)
        }
        g.draw(rect)
        return  rect
    }
    //画线
    private fun drawLine(start:Point2D,end:Point2D){
        g.draw(Line2D.Double(start,end))
    }

}

