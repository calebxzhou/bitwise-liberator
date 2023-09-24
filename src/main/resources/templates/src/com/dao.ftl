<#-- @ftlvariable name="entity" type="calebxzhou.codenliberate.model.Entity" -->

package com.dao

//${entity.name} 数据访问对象接口

public interface ${entity.id}DAO{

    //查询全部${entity.name}
    public List<${entity.id}> doSelectAll();

<#list entity.fields as field>
    //按${field.name}查询${entity.name}
    public List<${entity.id}> doSelectBy${field.capId}(${field.type} ${field.id});
</#list>


    //修改${entity.name}
    public boolean doUpdate(${entity.id} ${entity.asVar});

    //插入${entity.name}
    public boolean doInsert(${entity.id} ${entity.asVar});

    //删除${entity.name}
    public boolean doDelete(${entity.id} ${entity.asVar});


}