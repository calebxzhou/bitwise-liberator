package calebxzhou.codenliberate.fumodiam

import calebxzhou.codenliberate.stringMapFirstAsso
import org.jfree.svg.SVGGraphics2D
import java.awt.Font

class Fumodiam(private val pjName: String,private val dsl:String){
    companion object{

        val width = 1920
        val height = 1080
    }
    private val moduleFunction = stringMapFirstAsso(dsl)
    private val g = SVGGraphics2D(width.toDouble(),height.toDouble()).apply { font = Font("SimSun",Font.PLAIN, 30) }
    private val font = g.fontMetrics
    fun drawPicture(): ByteArray {
        val titleWidth = font.stringWidth(pjName)
        val titleStartX: Int = (width - titleWidth) / 2
        val titleStartY: Int = ((height - font.height) / 3)

        drawTextWithRect(pjName,titleStartX,titleStartY)
        //画标题
        //g.drawString(pjName, titleX, titleY+ font.ascent)
        //画标题框
        //g.drawRect(titleX-15,titleY-15,titleWidth+30,font.height+20)

        //画模块名
        var baseWidth = 100
        moduleFunction.forEach { t, u ->
            drawTextWithRect(t, baseWidth, titleStartY+200)
            u.forEachIndexed {i,func ->
                drawTextWithRect(func, baseWidth + i * 55, titleStartY+300,true)
            }
            baseWidth += 250
        }
        g.dispose()
//TODO 根据功能数量 分配每个模块的width
        //TODO 划线
        return g.svgElement.toByteArray()
    }

    //绘制文本+外框，rotate=true则竖着画
    fun drawTextWithRect(text:String,x:Int,y:Int,rotate: Boolean = false){
        if(!rotate){
            g.drawString(text, x, y+ font.ascent)
            g.drawRect(x-15,y-15,font.stringWidth(text)+30,font.height+20)

        }else{
            //旋转true，每个汉字占一行
            val baseH = y + font.ascent
            text.forEachIndexed { index, c ->
                g.drawString("$c", x, baseH + index * 40)
            }
            g.drawRect(x-10,y-10,50,text.length * 40+10)
        }
    }
}

