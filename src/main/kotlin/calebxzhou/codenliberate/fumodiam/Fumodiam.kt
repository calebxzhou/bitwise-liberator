package calebxzhou.codenliberate.fumodiam

import java.awt.Color
import java.awt.Font
import java.awt.FontMetrics
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

fun drawPicture(pjName: String,dsl:String): ByteArray {
    val width = 2000
    val height = 2000
    val modFunc = stringToMap(dsl)
    // Create a new image
    val bufferedImage = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)

    // Get the graphics context from the image
    val g = bufferedImage.createGraphics()

    // Set the background color and clear the image
    g.color = Color.WHITE
    g.fillRect(0, 0, width, height)

    // Set the color and font of the text
    g.color = Color.BLACK
    g.font = Font("SimSun",Font.PLAIN, 50)

    // Get the FontMetrics for the current font
    val fm: FontMetrics = g.fontMetrics

    // Calculate the x and y coordinates to center the text
    val titleWidth = fm.stringWidth(pjName)
    val titleX: Int = (width - titleWidth) / 2
    val titleY: Int = ((height - fm.height) / 3)

    //画标题
    g.drawString(pjName, titleX, titleY+ fm.ascent)
    //画标题框
    g.color = Color.BLACK;
    g.drawRect(titleX-5,titleY-5,titleWidth+10,fm.height+5)
    // Dispose the graphics context to free up system resources
    g.dispose()

    // Convert BufferedImage to ByteArray
    val baos = ByteArrayOutputStream()
    ImageIO.write(bufferedImage, "png", baos)

    return baos.toByteArray()
}
/*
kotlin functional programming, for a string a b c d \n e f g h \n i j k l m \n o p, make the string into a map, the map key is string, value is list<string>. split the string by \n as one entry, for each entry, the first element is key (e.g. a e i o), the remaining elements is value.
 */
fun stringToMap(input: String): Map<String, List<String>> {
    return input.split("\n")
        .map { it.split(" ") }
        .associate { it.first() to it.drop(1) }
}
