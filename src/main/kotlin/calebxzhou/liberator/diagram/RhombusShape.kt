package calebxzhou.liberator.diagram

import java.awt.Color
import java.awt.Polygon
import java.awt.geom.Point2D

/**
 * Created  on 2023-12-18,18:42.
 */
data class RhombusShape(
    val width:Int, val height:Int,
    val xLeft: Point2D, val xRight: Point2D, val yUp: Point2D, val yDown: Point2D
){
    companion object{
        //绘制文本+椭圆
        fun draw(diam: DiagramPainter, text:String, centerX:Int, centerY:Int): RhombusShape {
            val polygon = Polygon()
            val textWidth = diam.getTextWidth(text)
            val yUp = pointOf(centerX,centerY - diam.textHeight / 2 -20)
            val xLeft = pointOf(centerX - textWidth / 2 - 20, centerY)
            val yDown = pointOf(centerX,centerY + diam.textHeight / 2 + 20)
            val xRight = pointOf(centerX+ textWidth / 2 + 20, centerY)
            val width = xRight.x - xLeft.x
            val height = yDown.y - yUp.y
            polygon.addPoint(yUp).addPoint(xLeft).addPoint(yDown).addPoint(xRight)
            diam.g.color = Color.WHITE
            diam.g.fillPolygon(polygon)
            diam.g.color = Color.BLACK
            diam.g.draw(polygon)
            diam.drawString(text, (centerX - textWidth / 2), (centerY + diam.textAscent / 2))
            return RhombusShape(width.toInt(),height.toInt(),xLeft, xRight, yUp, yDown)
        }
    }
}
