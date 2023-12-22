CREATE DATABASE IF NOT EXISTS shixun_data;

<#list project.entities as entity>
    CREATE TABLE IF NOT EXISTS ${entity.id}(
        ${entity.getSqlCreateTableColumns()}
    );

</#list>
<#list project.entities as entity>
<#if entity.hasEntityRef>
    CREATE OR REPLACE VIEW ${entity.voTable} AS
    SELECT * FROM ${entity.id}
    <#list entity.fieldRefMap as refField,refEntity>
        INNER JOIN ${refEntity.id} on ${entity.id}.${refField.id} = ${refEntity.id}.${refEntity.primaryKey.id}
    </#list>
    ;
</#if>


</#list>
INSERT INTO systemuser (uname, pwd, roleName)
SELECT 'admin', 'password', '系统管理员'
WHERE NOT EXISTS (SELECT * FROM systemuser WHERE uname = 'admin');



