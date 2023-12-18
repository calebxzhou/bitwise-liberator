package calebxzhou.liberator.diagram

import java.awt.geom.Point2D

/**
 * Created  on 2023-11-12,8:19.
 */
data class EllipseShape(
    val width:Int, val height:Int,
    val xLeft:Point2D,val xRight:Point2D,val yUp:Point2D,val yDown:Point2D){
    val centerX = centerPosOf(xLeft,xRight).x
    val centerY = centerPosOf(yDown,yUp).y
    companion object{
        //绘制文本+椭圆
        fun draw(painter: DiagramPainter, text:String, x:Int, y:Int): EllipseShape {
            val textW = painter.getTextWidth(text)
            val oralW = textW + BASE_PADDING *4
            val oralH = 100
            val textX: Int = x + (oralW - textW) / 2
            val textY: Int = y + (oralH - painter.textHeight) / 2 + painter.textAscent
            painter.g.drawOval(x,y,oralW,oralH)
            painter.g.drawString(text,textX,textY)
            return EllipseShape(oralW,oralH,
                pointOf(x,y+oralH/2),
                pointOf(x+oralW,y+oralH/2),
                pointOf(x+oralW/2,y),
                pointOf(x+oralW/2,y+oralH))
        }
    }
}
