import java.awt.Color
import java.awt.Font
import java.awt.image.BufferedImage
import javax.swing.ImageIcon
import javax.swing.JFrame
import javax.swing.JLabel

object Main {
    @JvmStatic
    fun main(args: Array<String>) {
        // Create a new image with width 500 and height 500
        val image = BufferedImage(500, 500, BufferedImage.TYPE_INT_RGB)
        val g = image.createGraphics()

        // Set the background color to white
        g.color = Color.WHITE
        g.fillRect(0, 0, image.width, image.height)

        // Set the color to black and the font size to 30
        g.color = Color.BLACK
        g.font = Font("Arial", Font.PLAIN, 30)

        // Get the FontMetrics for the current font
        val fm = g.fontMetrics

        // Calculate the x and y coordinates to center "My First System"
        val s = "My First System"
        val x = (image.width - fm.stringWidth(s)) / 2
        val y = fm.ascent + (image.height - (fm.ascent + fm.descent)) / 2

        // Draw the string
        g.drawString(s, x, y)

        // Dispose the Graphics2D object
        g.dispose()

        // Display the image in a JFrame
        val frame = JFrame()
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)
        frame.contentPane.add(JLabel(ImageIcon(image)))
        frame.pack()
        frame.setLocationRelativeTo(null)
        frame.isVisible = true
    }
}
