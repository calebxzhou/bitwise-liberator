package calebxzhou.liberator.diagram

import calebxzhou.liberator.diagram.EllipseShape.Companion.draw
import java.awt.geom.Point2D

data class ActorShape(val armL:Point2D,val armR : Point2D){
    companion object{
        const val ACTOR_BODY_HEIGHT = 80
        const val ACTOR_HEAD_DIAMETER = 60
        const val ACTOR_ARM_LEN = 75
        //画系统角色小人带名字
        fun drawAtCenter(painter: DiagramPainter,text: String,cenX: Int,cenY : Int)= draw(painter,text,cenX- ACTOR_ARM_LEN/2,cenY- (ACTOR_BODY_HEIGHT+ ACTOR_HEAD_DIAMETER)/2)
        fun draw(painter: DiagramPainter, text: String, x:Int, y:Int): ActorShape {
            // Draw the head
            val headX = x - ACTOR_HEAD_DIAMETER /2
            val headY = y
            painter.g.drawOval(headX, headY, ACTOR_HEAD_DIAMETER, ACTOR_HEAD_DIAMETER)
            // Draw the body
            val bodyX = x
            val bodyY = headY + ACTOR_HEAD_DIAMETER
            painter.g.drawLine(bodyX, bodyY, bodyX, bodyY + ACTOR_BODY_HEIGHT)
            // Draw the arms
            val leftArmLegX = bodyX - ACTOR_ARM_LEN / 2
            val armY = bodyY + ACTOR_BODY_HEIGHT / 3
            val rightArmLegX = bodyX + ACTOR_ARM_LEN / 2

            val armP1 = pointOf(leftArmLegX,armY)
            val armP2 = pointOf(rightArmLegX,armY)
            painter.drawLine(armP1,armP2)

            // Draw the legs
            val legY = bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN / 2
            val legP1 = pointOf(bodyX,bodyY + ACTOR_BODY_HEIGHT)
            val leftLegP2 = pointOf(leftArmLegX, legY)
            val rightLegP2 =  pointOf(rightArmLegX, legY)
            painter.drawLine(legP1,leftLegP2)
            painter.drawLine(legP1,rightLegP2)

            painter.g.drawString(text, centerTextPosOf(painter,text,bodyX),bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN)
            return ActorShape(armP1,armP2)
        }

    }

}