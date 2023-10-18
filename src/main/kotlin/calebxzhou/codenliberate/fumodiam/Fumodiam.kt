package calebxzhou.codenliberate.fumodiam

import calebxzhou.codenliberate.stringMapFirstAsso
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Rectangle
import java.awt.geom.Rectangle2D

class Fumodiam(private val pjName: String,private val dsl:String){
    companion object{
        val width = 3840
        val height = 1080
        val fontSize = 30
    }
    //模块功能定义，并去掉空模块
    private val moduleFunction = stringMapFirstAsso(dsl).filter { it.key.isNotBlank() }
    private val g = SVGGraphics2D(width.toDouble(),height.toDouble()).apply { font = Font("SimSun",Font.PLAIN, fontSize) }
    private val font = g.fontMetrics
    fun drawPicture(): ByteArray {
        val centerX = width / 2
        //val titleWidth = font.stringWidth(pjName)
        //val titleStartX: Int = (width - titleWidth) / 2
        val titleStartY: Int = 50
        //画标题
        //drawTextWithRect(pjName,titleStartX,titleStartY,15,15)


        var baseX = 300
        moduleFunction.forEach { module, functions ->
            drawModule(baseX,titleStartY + 200 ,module,functions)
                .also {width ->  baseX += 150 + width }
        }




        g.dispose()
        //TODO 划线
        return g.svgElement.toByteArray()
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
            Rectangle(x-paddingX,y-paddingY, fontSize + paddingX * 2,text.length * (fontSize + 10 ) + paddingY * 2)
        }
        g.draw(rect)
        return  rect
    }
    //绘制带框文本，rotate=true则竖着画
    private fun drawRectWithText(
        text:String,
        x:Int,
        y:Int,
        width: Int,
        height:Int,
        paddingX: Int,
        paddingY: Int,
        rotate: Boolean = false
    ) : Rectangle {
        val rect = Rectangle(x,y,width, height)

        return rect
    }

        //绘制单个模块，返回此模块的width
    private fun drawModule(x: Int, y: Int, moduleName: String, functions: List<String>): Int{
        // X轴起始位置
        val startX = x
        // X轴终止位置
        val endX = startX + font.stringWidth(moduleName)
        // X轴中心位置
        val centerX = (startX + endX)/2
        //画模块名，功能越多，padding越大
        val moduleWidth = drawTextWithRect(moduleName, centerX, y, 15 * functions.size, 15).width.toInt()
        //分配位置 X轴
        val xPoses = mutableListOf<Int>()
        for (i in functions.indices) {
            xPoses += (i * moduleWidth) / (functions.size - 1)
        }
        var moduleFuncWidth = 0
        functions.forEachIndexed {i,func ->
            //画每一个功能
            drawTextWithRect(func, centerX + xPoses[i]-30 , y+200,15,15,true)
                .also { moduleFuncWidth += it.width.toInt() }
        }
        return moduleFuncWidth + moduleWidth
    }
}

