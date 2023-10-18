package calebxzhou

fun main() {
    print("Enter a number: ")
    val n = readLine()!!.toInt()
    val sequence = generateSequence(n)
    println(sequence.joinToString(" "))
}

fun generateSequence(n: Int): List<Int> {
    val increment = 100 / n
    return List(n) { index -> (index + 1) * increment }
}
