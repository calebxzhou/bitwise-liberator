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



