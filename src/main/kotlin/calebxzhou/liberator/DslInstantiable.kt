package calebxzhou.liberator

import calebxzhou.liberator.headfoot.HeadFoot

/**
 * Created  on 2023-11-01,20:38.
 */
//可通过读dsl创建实例的
interface DslInstantiable<T> {
    fun fromDsl(dsl:String): T
}