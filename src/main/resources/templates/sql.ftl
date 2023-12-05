<#-- @ftlvariable name="project" type="calebxzhou.liberator.model.Project" -->
create database shixun;
use shixun;

<#list project.entities as entity>
    create table ${entity.id} (
    <#list entity.fields as field>
        ${field.id} varchar(100)
    </#list>
    )
</#list>
insert into User values('admin','123456','0');







