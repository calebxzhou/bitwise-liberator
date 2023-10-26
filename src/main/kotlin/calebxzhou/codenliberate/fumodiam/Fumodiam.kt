package calebxzhou.codenliberate.fumodiam

import calebxzhou.codenliberate.stringMapFirstAsso
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Rectangle
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

        moduleFunction.forEach {moduleName,functions ->
            val currentFunctionStartX = x
            functions.forEach{
                //去掉功能名的两端空格
                val functionName = it.trim()
                //画每一个功能
                val rect = drawTextWithRect(functionName, x , 300,15,15,true)
                x += rect.width.toInt() + 20
            }
            val currentFunctionEndX = x
            drawTextWithRect(moduleName,
                (currentFunctionEndX + currentFunctionStartX)/2-font.stringWidth(moduleName)/2-15*2,
                150, BASE_PADDING, BASE_PADDING)

        }
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
    private fun drawModule(startX: Int, y: Int, moduleName: String, functions: List<String>): Int{
        // X轴终止位置
        val endX = startX + font.stringWidth(moduleName)
        // X轴中心位置
        val centerX = (startX + endX)/2
        //画模块名，功能越多，padding越大
        val moduleWidth = drawTextWithRect(moduleName, centerX, y, BASE_PADDING * functions.size, BASE_PADDING).width.toInt()
        //分配位置 X轴
        val xPoses = mutableListOf<Int>()
        for (i in functions.indices) {
            xPoses += (i * moduleWidth) / (functions.size - 1)
        }
        var moduleFuncWidth = 0
        functions.forEachIndexed {i,func ->
            //画每一个功能
            drawTextWithRect(func, centerX + xPoses[i]-30 , y+200,BASE_PADDING,BASE_PADDING,true)
                .also { moduleFuncWidth += it.width.toInt() }
        }
        return moduleFuncWidth + moduleWidth
    }
}

