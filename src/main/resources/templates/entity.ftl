
package com.ssm.entity;

//${entity.name}
public class ${entity.capId} implements java.io.Serializable{

<#list entity.fields as field>
    //${field.name}
    private ${field.type} ${field.id};
</#list>


<#list entity.fields as field>
    public ${field.type} get${field.capId}(){
        return this.${field.id};
    }
    public void set${field.capId}(String ${field.id}){
        this.${field.id} = ${field.id};
    }
</#list>

    public String toString(){
        return <#list entity.fields as field>
            ${field.id} + "," +
        </#list>
        ".";
    }


}