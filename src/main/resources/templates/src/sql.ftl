<#-- @ftlvariable name="project" type="calebxzhou.codenliberate.model.Project" -->
--第一部分，第二部分，第三部分需要分开执行，请您注意~



--第一部分始
create database shixun;
--第一部分终



--第二部分始
use shixun;

<#list project.entities as entity>
    --${entity.name}表格
    create table ${entity.id} (
    <#list entity.fields as field>
        ${field.id} varchar(50), --${field.name}
    )
    </#list>
    go
</#list>
insert into Usr values('admin','123456','123');
--第二部分终







