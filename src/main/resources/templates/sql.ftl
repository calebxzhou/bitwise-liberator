<#list project.entities as entity>
    CREATE TABLE IF NOT EXISTS ${entity.id}(
        ${entity.getSqlCreateTableColumns()}
    );
</#list>







