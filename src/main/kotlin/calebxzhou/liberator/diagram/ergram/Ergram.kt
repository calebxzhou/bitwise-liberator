package calebxzhou.liberator.diagram.ergram

import calebxzhou.liberator.diagram.*
import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace
import java.awt.Polygon

enum class EntityRelations(val dslToken: String) {
    I_I("一对一"),
    M_I("多对一"),
    I_M("一对多"),
    M_N("多对多"),

    ;
    companion object{
        fun match(token: String) = entries.find { token in it.dslToken }
        fun hasToken(str:String) = entries.find { str.contains(it.dslToken) } != null
    }

}
data class Relation(
    val fromEntity: Entity,
    val rel: EntityRelations,
    val verb: String,
    val toEntity: Entity,
)
data class Entity(
    val name:String,
    val fields: MutableList<String> = arrayListOf(),

){
}
data class Ergram(
    val entities: MutableMap<String,Entity> = linkedMapOf(),
    val rels: MutableList<Relation> = arrayListOf()
){
    operator fun plusAssign(entity: Entity){
        entities += entity.name to entity
    }
    operator fun get(entityName:String) = entities[entityName]


    private var x = START_X
    private var y= 50
    private val diam = DiagramPainter()
    fun draw(): ByteArray {
        drawEntities()
        diam.done()
        return diam.data
    }

    private fun drawEntities() {
        val entityShapes = linkedMapOf<Entity,EllipseShape>()
        for ((index, entity) in entities.values.withIndex()) {
            //达到size/2去下面画
            if(index == entities.size /2){
                y += 1500
                x = START_X
            }
            val entityShape = EllipseShape.draw(diam,entity.name,x,if(y < 1500) y+300 else y - 300)
            entityShapes += entity to entityShape
            for (field in entity.fields) {
                val fieldShape = EllipseShape.draw(diam,field, x,y).also {
                    x += it.width+50
                }
                if(y<1500)
                    diam.drawLine(entityShape.yUp,fieldShape.yDown)
                else
                    diam.drawLine(entityShape.yDown,fieldShape.yUp)
            }
        }
        for (rel in rels) {
            val fromShape = entityShapes[rel.fromEntity]
            val toShape = entityShapes[rel.toEntity]
            if(fromShape != null && toShape != null){
                val (startPoint,endPoint) =
                    //水平 左
                    if(fromShape.centerX < toShape.centerX && fromShape.centerY == toShape.centerY)
                        (fromShape.xRight to toShape.xLeft)
                    //水平 右
                    else if(fromShape.centerX > toShape.centerX && fromShape.centerY == toShape.centerY)
                        (fromShape.xLeft to toShape.xRight)
                    // 垂直
                    else if(fromShape.centerY < toShape.centerY)
                        (fromShape.yDown to toShape.yUp)
                    else if(fromShape.centerY > toShape.centerY)
                        (fromShape.yUp to toShape.yDown)
                    else
                        pointOf(0,0) to pointOf(0,0)
                val centerX = centerPosOf(startPoint.x,endPoint.x)
                val centerY = centerPosOf(startPoint.y,endPoint.y)
                diam.drawLine(startPoint,endPoint)
                val shape = RhombusShape.draw(diam,rel.verb,centerX.toInt(),centerY.toInt())
                val relFromPoint = pointAtFraction(startPoint,endPoint,1.5/5)
                val relToPoint = pointAtFraction(startPoint,endPoint,4.5/5)
                when(rel.rel){
                    EntityRelations.I_I -> {
                        diam.drawString("1",relFromPoint)
                        diam.drawString("1",relToPoint)
                    }
                    EntityRelations.M_I -> {
                        diam.drawString("m",relFromPoint)
                        diam.drawString("1",relToPoint)
                    }
                    EntityRelations.I_M -> {
                        diam.drawString("1",relFromPoint)
                        diam.drawString("m",relToPoint)
                    }
                    EntityRelations.M_N -> {
                        diam.drawString("m",relFromPoint)
                        diam.drawString("n",relToPoint)
                    }
                }
            }
        }
    }



    companion object{
        fun fromDsl(dsl:String) : Ergram{
            val ergram = Ergram()
            val rows = dsl.splitByReturn()
            for (row in rows) {
                val tokens = row.splitBySpace()
                if(EntityRelations.hasToken(row)){
                    val fromEntity = ergram[tokens.removeFirst()]
                    val toEntity = ergram[tokens.removeLast()]
                    if(fromEntity != null && toEntity != null){
                        val rel = EntityRelations.match(tokens.removeFirst())?:continue
                        val verb = tokens.removeFirst()
                        val relation = Relation(fromEntity, rel, verb, toEntity)
                        ergram += relation
                    }
                }else{
                    val entity = Entity(tokens.removeFirst(),tokens)
                    ergram += entity
                }

            }
            return ergram
        }
    }

     operator fun plusAssign(relation: Relation) {
        rels += relation
    }
}
