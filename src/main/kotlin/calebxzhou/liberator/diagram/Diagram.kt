package calebxzhou.liberator.diagram

import calebxzhou.getResource
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Point
import java.awt.Rectangle
import java.awt.geom.Line2D
import java.awt.geom.Point2D
import java.awt.geom.Rectangle2D


const val WIDTH = 3840
const val HEIGHT = 3840
const val FONT_SIZE = 30
const val START_X = 100
const val BASE_PADDING = 15
val SIMSUN_FONT = Font.createFont(Font.TRUETYPE_FONT, getResource("/simsun.ttf")).deriveFont(FONT_SIZE.toFloat())

//创建Point2D 点对象
fun pointOf(x: Double,y:Double) = Point2D.Double(x,y)
fun pointOf(x:Int,y:Int): Point2D = Point(x,y)
//坐标中心
fun centerPosOf(d1:Double, d2:Double) = (d1+d2)/2
fun centerPosOf(d1:Int, d2:Int) = (d1+d2)/2
//两点中心
fun centerPosOf(p1:Point2D, p2:Point2D) = pointOf(centerPosOf(p1.x , p2.x), centerPosOf(p1.y , p2.y))
//让文本居中的坐标值
fun centerTextPosOf(painter: DiagramPainter, text: String, d1:Int, d2:Int) = centerTextPosOf(painter,text, centerPosOf(d1, d2))
fun centerTextPosOf(painter: DiagramPainter, text: String, centerPos:Int) = centerPos - painter.getTextWidth(text)/2
//画矢量图
class DiagramPainter{
    val g = SVGGraphics2D(WIDTH.toDouble(), HEIGHT.toDouble()).apply {
        font = SIMSUN_FONT
    }
    private val font = g.fontMetrics
    //  文字宽度
    fun getTextWidth(text:String)=font.stringWidth(text)
    val textHeight=font.height
    val textAscent = font.ascent
    //画线
    fun drawLine(start: Point2D, end: Point2D){
        g.draw(Line2D.Double(start,end))
    }
    fun drawString(str:String,x:Int,y:Int){
        g.drawString(str,x,y)
    }
    //绘制文本+外框，rotate=true则竖着画
    fun drawTextWithRect(
        text:String,
        x:Int,
        y:Int,
        paddingX: Int,
        paddingY:Int,
        rotate: Boolean = false
    ): Rectangle2D {
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
    fun drawTextWithRectWH(
        text:String,
        x:Int,
        y:Int,
        paddingX: Int,
        paddingY:Int,
        rectWidth:Int,
        rectHeight: Int,
        useVerticalText: Boolean = false
    ): Rectangle2D {
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
    fun done(){
        g.dispose()
    }
    val data
    get() = g.svgElement.toByteArray()

    companion object{

    }
}
