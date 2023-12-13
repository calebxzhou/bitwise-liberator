DROP ALL OBJECTS;
DROP ALL OBJECTS DELETE FILES;

<#list project.entities as entity>
    CREATE TABLE IF NOT EXISTS ${entity.id}(
        ${entity.getSqlCreateTableColumns()}
    );

</#list>
<#list project.entities as entity>
<#if entity.hasEntityRef>
    CREATE VIEW IF NOT EXISTS ${entity.voTable} AS
    SELECT * FROM ${entity.id}
    <#list entity.fieldRefMap as refField,refEntity>
        INNER JOIN ${refEntity.id} on ${entity.id}.${refField.id} = ${refEntity.id}.${refEntity.primaryKey.id}
    </#list>
    ;
</#if>


</#list>
INSERT INTO role (roleName)
SELECT '系统管理员'
WHERE NOT EXISTS (
SELECT * FROM role
WHERE roleName = '系统管理员')
;
INSERT INTO systemuser (uname, pwd, systemuser_roleId)
SELECT 'admin', 'password', 1
WHERE NOT EXISTS (SELECT * FROM systemuser WHERE uname = 'admin');



