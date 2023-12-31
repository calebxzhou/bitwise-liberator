package calebxzhou

import calebxzhou.liberator.ssm.SsmProject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

fun unzip(byteArray: ByteArray, outputDirectory: String) {
    ByteArrayInputStream(byteArray).use { bais ->
        ZipInputStream(bais).use { zis ->
            generateSequence { zis.nextEntry }.forEach { zipEntry: ZipEntry ->
                val newFile = File(outputDirectory, zipEntry.name)
                if (zipEntry.isDirectory) {
                    if (!newFile.isDirectory && !newFile.mkdirs()) {
                        throw RuntimeException("Failed to create directory " + newFile.absolutePath)
                    }
                } else {
                    // Make sure the parent directory exists
                    newFile.parentFile?.mkdirs()
                    if(!newFile.exists()){
                        newFile.createNewFile()
                    }
                    FileOutputStream(newFile).use { fos ->
                        zis.copyTo(fos)
                    }
                }
            }
        }
    }
}



fun main() {
    SsmProject.fromDsl("学生成绩管理系统", """
        学院college
        教室room
        学期semester
        成绩类型scoretype
        学生student 学院 姓名stname 电话stphone 出生日期stbirth
        教师teacher 学院 姓名tename 电话tephone 出生日期tebirth
        课程course 课名cname 教师 教室 考试类型examtype
        选课enroll 学生 学期 课程
        成绩score 选课 成绩类型 分数mark
    """.trimIndent(), """
        教务处老师 课程r 选课crud 成绩crud
选课学生 课程r 选课r 成绩r
游客 课程r
    """.trimIndent()).genCodeZip().let {
        unzip(it, "/Users/calebzhou/coding/eclipse-workspace/SsmGenTest/")
    }

}