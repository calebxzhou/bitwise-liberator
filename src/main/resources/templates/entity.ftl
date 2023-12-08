package com.ssm.entity;

//${entity.name}实体类
public class ${entity.capId}{

<#list entity.classFields as field>
    //${field.name}
    private ${field.type} ${field.id};
</#list>


<#list entity.classFields as field>
    //获取${field.name}
    public ${field.type} get${field.capId}(){
        return this.${field.id};
    }
    //设置${field.name}
    public void set${field.capId}(${field.type} ${field.id}){
        this.${field.id} = ${field.id};
    }
</#list>

    //转换为字符串
    public String toString(){
        return <#list entity.classFields as field>
            ${field.id} + "," +
        </#list>
        ".";
    }
    <#if entity.hasEntityRef>


    //${entity.name}视图类
    public class Vo{

        <#list entity.voFields as field>
            //${field.name}
            private ${field.type} ${field.id};
        </#list>


        <#list entity.voFields as field>
            //获取${field.name}
            public ${field.type} get${field.capId}(){
            return this.${field.id};
            }
            //设置${field.name}
            public void set${field.capId}(${field.type} ${field.id}){
            this.${field.id} = ${field.id};
            }
        </#list>

        //转换为字符串
        public String toString(){
        return <#list entity.voFields as field>
            ${field.id} + "," +
        </#list>
        ".";
        }


    }
    </#if>
}