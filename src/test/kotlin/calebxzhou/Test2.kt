package calebxzhou

import com.github.javaparser.StaticJavaParser

fun main() {
    StaticJavaParser.parse("""
        
        package com.entity;

        //学院
        public class College implements java.io.Serializable{

            //学院编号
            private String id;
            //学院名称
            private String name;


            public String getId(){
                return this.id;
            }
            public void setId(String id){
                this.id = id;
            }
            public String getName(){
                return this.name;
            }
            public void setName(String name){
                this.name = name;
            }

            public String toString(){
                return 
                    id + "," +

                    name + "," +
                ".";
            }


        }
    """.trimIndent()).allComments.let { println(it) }
}