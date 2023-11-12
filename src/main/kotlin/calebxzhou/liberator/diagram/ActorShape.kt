package calebxzhou.liberator.diagram

import java.awt.geom.Point2D

data class ActorShape(val armL:Point2D,val armR : Point2D){
    companion object{
        const val ACTOR_BODY_HEIGHT = 80
        const val ACTOR_HEAD_DIAMETER = 60
        const val ACTOR_ARM_LEN = 75
        //画系统角色小人带名字
        fun draw(drawer: DiagramPainter, text: String, x:Int, y:Int): ActorShape {
            // Draw the head
            val headX: Int = (x - ACTOR_HEAD_DIAMETER /2)
            val headY = y
            drawer.g.drawOval(headX, headY, ACTOR_HEAD_DIAMETER, ACTOR_HEAD_DIAMETER)
            // Draw the body
            val bodyX = x
            val bodyY = headY + ACTOR_HEAD_DIAMETER
            drawer.g.drawLine(bodyX, bodyY, bodyX, bodyY + ACTOR_BODY_HEIGHT)
            // Draw the arms
            val leftArmLegX = bodyX - ACTOR_ARM_LEN / 2
            val armY = bodyY + ACTOR_BODY_HEIGHT / 3
            val rightArmLegX = bodyX + ACTOR_ARM_LEN / 2

            val armP1 = pointOf(leftArmLegX,armY)
            val armP2 = pointOf(rightArmLegX,armY)
            drawer.drawLine(armP1,armP2)

            // Draw the legs
            val legY = bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN / 2
            val legP1 = pointOf(bodyX,bodyY + ACTOR_BODY_HEIGHT)
            val leftLegP2 = pointOf(leftArmLegX, legY)
            val rightLegP2 =  pointOf(rightArmLegX, legY)
            drawer.drawLine(legP1,leftLegP2)
            drawer.drawLine(legP1,rightLegP2)

            drawer.g.drawString(text,bodyX - drawer.getTextWidth(text)/2,bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN)
            return ActorShape(armP1,armP2)
        }

    }

}