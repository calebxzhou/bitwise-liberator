val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    kotlin("jvm") version "1.9.10"
    kotlin("plugin.serialization") version "1.9.10"
    id("io.ktor.plugin") version "2.3.4"
}

group = "calebxzhou"
version = "0.0.1"

application {
    mainClass.set("calebxzhou.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    // https://mvnrepository.com/artifact/io.github.microutils/kotlin-logging-jvm
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
    implementation ("com.github.javaparser:javaparser-core:3.25.5")
    testImplementation("io.ktor:ktor-server-tests-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
    // https://mvnrepository.com/artifact/org.freemarker/freemarker
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
    implementation("io.ktor:ktor-server-freemarker:$ktor_version")
    implementation("io.ktor:ktor-server-status-pages:$ktor_version")
}
