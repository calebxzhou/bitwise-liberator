package calebxzhou.liberator.diagram

import calebxzhou.getResource
import org.jfree.svg.SVGGraphics2D
import java.awt.Font
import java.awt.Point
import java.awt.Polygon
import java.awt.Rectangle
import java.awt.geom.Line2D
import java.awt.geom.Point2D
import java.awt.geom.Rectangle2D
import kotlin.math.*


const val WIDTH = 8000
const val HEIGHT = 8000
const val FONT_SIZE = 30
const val START_X = 100
const val START_Y = 100
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
//两点距离
fun distanceOf(d1:Int,d2:Int) = abs(d1-d2)
fun distanceOf(d1:Double,d2:Double) = abs(d1-d2)
//让文本居中的坐标值
fun centerTextPosOf(painter: DiagramPainter, text: String, d1:Int, d2:Int) = centerTextPosOf(painter,text, centerPosOf(d1, d2))
fun centerTextPosOf(painter: DiagramPainter, text: String, centerPos:Int) = centerPos - painter.getTextWidth(text)/2
fun Polygon.addPoint(p: Point2D): Polygon {
    this.addPoint(p.x.toInt(), p.y.toInt())
    return this
}
fun pointAtFraction(p1: Point2D, p2: Point2D, fraction: Double): Point2D {
    val dx = p2.x - p1.x
    val dy = p2.y - p1.y
    return Point2D.Double(p1.x + dx * fraction, p1.y + dy * fraction)
}
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
    //两个图形连在一起
    //-90~+
    fun drawLineConnectShapes(fromShape: EllipseShape,toShape: EllipseShape): Pair<Point2D,Point2D>{
        val x1 = fromShape.centerX
        val x2 = toShape.centerX
        val y1 = fromShape.centerY
        val y2 = toShape.centerY
        val dx = x2-x1
        val dy = y2-y1
        val radian = atan2(dy, dx)
        val deg = Math.toDegrees(radian)
        val (startPoint,endPoint) =
            when {
                deg in -135.0 .. -45.0 -> (fromShape.yUp to toShape.yDown)
                deg in -45.0 .. 45.0 -> {
                    (fromShape.xRight to toShape.xLeft)
                }
                deg in 45.0 .. 135.0  -> {
                    (fromShape.yDown to toShape.yUp)
                }
                deg > 135.0 || deg < -45.0 -> {
                    (fromShape.xLeft to toShape.xRight)
                }
                /* (fromShape.xRight to toShape.xLeft)
             //水平 右
             else if(fromShape.centerX > toShape.centerX && fromShape.centerY == toShape.centerY)
                 (fromShape.xLeft to toShape.xRight)
             // 垂直
             else if(fromShape.centerY < toShape.centerY)
                 (fromShape.yDown to toShape.yUp)
             else if(fromShape.centerY > toShape.centerY)
                 (fromShape.yUp to toShape.yDown)*/
                else -> pointOf(0,0) to pointOf(0,0)
            }
        drawLine(startPoint,endPoint)
        return startPoint to endPoint
    }
    fun drawArrowLine(start: Point2D,end: Point2D,hollow:Boolean){
        val arrowSize = 20
        val angle = atan2(end.y - start.y, end.x - start.x)
        val x2 = end.x.toInt()
        val y2 = end.y.toInt()
        //箭头三角点1
        val tx1 = x2 - arrowSize * cos(angle - Math.PI / 6)
        val ty1 = y2 - arrowSize * sin(angle - Math.PI / 6)
        val tp1 = pointOf(tx1,ty1)
        //箭头三角点2
        val tx2 = x2 - arrowSize * cos(angle + Math.PI / 6)
        val ty2 = y2 - arrowSize * sin(angle + Math.PI / 6)
        val tp2 = pointOf(tx2,ty2)
        drawLine(start, centerPosOf(tp1,tp2))
        if(hollow){
            drawLine(end,tp1)
            drawLine(end,tp2)
            drawLine(tp1,tp2)
        }else{
            val xa = IntArray(3)
            xa[0] = end.x.toInt()
            xa[1] = tp1.x.toInt()
            xa[2] = tp2.x.toInt()
            val ya = IntArray(3)
            ya[0] = end.y.toInt()
            ya[1] = tp1.y.toInt()
            ya[2] = tp2.y.toInt()
            g.fillPolygon(xa, ya,3)
        }


    }
    fun drawString(str:String, x: Int, y:Int){
        g.drawString(str,x,y)
    }
    fun drawString(str:String, p:Point2D) = drawString(str,p.x.toInt(),p.y.toInt())
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

    fun draw(polygon: Polygon) {
        g.draw(polygon)
    }

    val data
    get() = g.svgElement.toByteArray()

    companion object{

    }
}
