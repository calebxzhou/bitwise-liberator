<#list project.entities?values as entity>
    CREATE TABLE IF NOT EXISTS ${entity.id}(
    ${entity.getSqlCreateTableColumns(project)}
    );
</#list>







