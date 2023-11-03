package calebxzhou.liberator

/**
 * Created  on 2023-11-02,20:06.
 */
class LiberatorException(reason:String): Exception("发生了错误：$reason") {
}