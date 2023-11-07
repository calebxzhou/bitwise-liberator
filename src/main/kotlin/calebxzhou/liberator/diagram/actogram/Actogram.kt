package calebxzhou.liberator.diagram.actogram

import calebxzhou.liberator.DslInstantiable
import calebxzhou.liberator.splitByReturn
import calebxzhou.liberator.splitBySpace

data class ActFunc(val actor: String, val funcs:List<String>)
data class Actogram(val acts: List<ActFunc>){
    companion object : DslInstantiable<Actogram>{
        override fun fromDsl(dsl: String): Actogram {
            val rows = dsl.splitByReturn()
            val acts = arrayListOf<ActFunc>()
            for (row in rows) {
                val words = row.splitBySpace()
                val actor = words.removeFirst()
                acts += ActFunc(actor,words)
            }
            return Actogram(acts)
        }
    }
    fun draw(){

    }
}