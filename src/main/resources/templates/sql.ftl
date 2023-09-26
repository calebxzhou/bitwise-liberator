<#-- @ftlvariable name="project" type="calebxzhou.codenliberate.model.Project" -->
create database shixun;
use shixun;

<#list project.entities as entity>
    create table ${entity.id} (
    <#list entity.fields as field>
        ${field.id} varchar(50)
    </#list>
    )
    go
</#list>
insert into Usr values('admin','123456','123');







