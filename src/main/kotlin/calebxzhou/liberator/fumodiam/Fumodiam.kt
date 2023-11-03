package calebxzhou.liberator.fumodiam

import calebxzhou.getResource
import calebxzhou.liberator.DslInstantiable
import calebxzhou.liberator.LiberatorException
import io.ktor.server.application.*
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Rectangle
import java.awt.geom.Line2D
import java.awt.geom.Point2D
import java.awt.geom.Rectangle2D

data class Module(val name:String,val funcs:List<String>)
data class Fumodiam(val pjName: String, val modules: List<Module>,val unifyFuncHeight: Boolean){
    companion object : DslInstantiable<Fumodiam>{
        const val WIDTH = 3840
        const val HEIGHT = 1080
        const val FONT_SIZE = 30
        const val START_X = 100
        const val BASE_PADDING = 15
        val simsunFont = Font.createFont(Font.TRUETYPE_FONT, getResource("/simsun.ttf")).deriveFont(FONT_SIZE.toFloat())
        override fun fromDsl(dsl: String): Fumodiam {
            val rows = dsl.split("\n").toMutableList()
            val pjName = rows.removeFirst()
            val modules = arrayListOf<Module>()
            var unifyFuncHeight = false
            for (row in rows) {
                if(row.isBlank())
                    continue
                if(row.contains("@功能统一高度")){
                    unifyFuncHeight = true
                    continue
                }
                val words = row.trim().split(Regex("\\s+")).toMutableList()
                if(words.size<4){
                    throw LiberatorException("每个模块至少3个功能")
                }
                val moduleName = words.removeFirst()
                modules += Module(moduleName,words)
            }
            return Fumodiam(pjName,modules,unifyFuncHeight)
        }
    }
    private val g = SVGGraphics2D(WIDTH.toDouble(),HEIGHT.toDouble()).apply {
        font = simsunFont
    }
    private val font = g.fontMetrics
    private var x = START_X
    fun drawPicture(): ByteArray {
        drawFunctions()
        g.dispose()
        return g.svgElement.toByteArray()
    }

    // 画功能
    private fun drawFunctions() {
        //每个模块 竖线所在的起始点
        val moduleVlineStartPoints = arrayListOf<Point2D>()
        //TODO
        //名字最长的那个功能的高度
        val longestFuncHeight = modules.flatMap { it.funcs }.maxBy { it.length }.length* (FONT_SIZE + 10 ) + BASE_PADDING * 2
        //画每个模块
        for ((moduleName, functions) in modules) {
            //每个功能 竖线所在的起始点
            val vlineStartPoints = arrayListOf<Point2D>()
            val functionStartX = x

            //画每个功能
            for (func in functions) {
                //去掉功能名的两端空格
                val functionName = func.trim()
                if(functionName.isBlank())
                    continue
                //画每一个功能名称
                val rect = if(unifyFuncHeight)
                    drawTextWithRectWH(functionName,x,300, BASE_PADDING, BASE_PADDING,FONT_SIZE + BASE_PADDING * 2,longestFuncHeight,true)
                else
                    drawTextWithRect(functionName, x , 300,BASE_PADDING,BASE_PADDING,true)
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
    private fun drawTextWithRect(
        text:String,
        x:Int,
        y:Int,
        paddingX: Int,
        paddingY:Int,
        rotate: Boolean = false
    ): Rectangle2D{
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
    //绘制文本+外框（可自定义外框的高度和宽度），rotate=true则竖着画
    private fun drawTextWithRectWH(
        text:String,
        x:Int,
        y:Int,
        paddingX: Int,
        paddingY:Int,
        rectWidth:Int,
        rectHeight: Int,
        useVerticalText: Boolean = false
    ): Rectangle2D{
        val rect : Rectangle2D = if(!useVerticalText){
            g.drawString(text, x, y+ font.ascent)
            Rectangle(x-paddingX,y-paddingY,rectWidth,rectHeight)
        }else{
            //旋转true，每个汉字占一行
            val baseH = y + font.ascent
            text.forEachIndexed { index, c ->
                g.drawString("$c", x, baseH + index * 40)
            }
            Rectangle(x-paddingX,y-paddingY, rectWidth,rectHeight)
        }
        g.draw(rect)
        return  rect
    }
    //画线
    private fun drawLine(start:Point2D,end:Point2D){
        g.draw(Line2D.Double(start,end))
    }

}

