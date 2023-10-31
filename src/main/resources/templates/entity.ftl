<#-- @ftlvariable name="entity" type="calebxzhou.liberator.model.Entity" -->

package com.entity;

//${entity.name}
public class ${entity.id} implements java.io.Serializable{

<#list entity.fields as field>
    //${field.name}
    private ${field.type} ${field.id};
</#list>


<#list entity.fields as field>
    public ${field.type} get${field.capId}(){
        return this.${field.id};
    }
    public void set${field.capId}(${field.type} ${field.id}){
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