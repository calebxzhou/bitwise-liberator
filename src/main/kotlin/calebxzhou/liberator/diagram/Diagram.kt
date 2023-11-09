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
fun centerOf(d1:Double, d2:Double) = (d1+d2)/2
fun centerOf(d1:Int, d2:Int) = (d1+d2)/2
fun centerOf(p1:Point2D,p2:Point2D) = pointOf(centerOf(p1.x , p2.x), centerOf(p1.y , p2.y))
//画矢量图
class DiagramDrawer{
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
    //绘制文本+椭圆
    fun drawTextWithOral(text: String,x: Int,y: Int){
        val textW = getTextWidth(text)
        val oralW = textW + BASE_PADDING *4
        val oralH = 100
        val textX: Int = x + (oralW - textW) / 2
        val textY: Int = y + (oralH - textHeight) / 2 + textAscent
        g.drawOval(x,y,oralW,oralH)
        g.drawString(text,textX,textY)
    }
    //画系统角色小人带名字 返回左右两条胳膊的点

    fun drawActor(text: String,x:Int,y:Int) : Pair<Point2D,Point2D>{
        // Draw the head
        val headX: Int = (x - ACTOR_HEAD_DIAMETER/2)
        val headY = y
        g.drawOval(headX, headY, ACTOR_HEAD_DIAMETER, ACTOR_HEAD_DIAMETER)
        // Draw the body
        val bodyX = x
        val bodyY = headY + ACTOR_HEAD_DIAMETER
        g.drawLine(bodyX, bodyY, bodyX, bodyY + ACTOR_BODY_HEIGHT)
        // Draw the arms
        val leftArmLegX = bodyX - ACTOR_ARM_LEN / 2
        val armY = bodyY + ACTOR_BODY_HEIGHT / 3
        val rightArmLegX = bodyX + ACTOR_ARM_LEN / 2

        val armP1 = pointOf(leftArmLegX,armY)
        val armP2 = pointOf(rightArmLegX,armY)
        drawLine(armP1,armP2)

        // Draw the legs
        val legY = bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN / 2
        val legP1 = pointOf(bodyX,bodyY + ACTOR_BODY_HEIGHT)
        val leftLegP2 = pointOf(leftArmLegX, legY)
        val rightLegP2 =  pointOf(rightArmLegX, legY)
        drawLine(legP1,leftLegP2)
        drawLine(legP1,rightLegP2)

        g.drawString(text,bodyX - getTextWidth(text)/2,bodyY + ACTOR_BODY_HEIGHT+ACTOR_ARM_LEN)
        return  armP1 to armP2
    }
    fun done(){
        g.dispose()
    }
    val data
    get() = g.svgElement.toByteArray()

    companion object{
        const val ACTOR_BODY_HEIGHT = 80
        const val ACTOR_HEAD_DIAMETER = 60
        const val ACTOR_ARM_LEN = 75
    }
}
