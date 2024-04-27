//{{entity.name}}的数据库映射类
package com.ssm.mapper;
<#assign pk = entity.primaryKey>
import com.ssm.entity.*;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@Mapper
public interface {{entity.capId}}Mapper {
    //选择所有{{entity.name}}
    @Select("select * from {{entity.voTable}}")
    List<{{entity.voId}}> selectAll();

    <#list entity.voFields as field>
    //按{{field.name}}选出{{entity.name}}
    @Select("select * from {{entity.voTable}} where {{field.id}} = {{"#"}}{{{field.id}}}")
    <#if pk == field>{{entity.voId}}<#else>List<{{entity.voId}}></#if> selectBy{{field.capId}}({{field.type}} {{field.id}});
    </#list>

    //插入{{entity.name}}
    @Insert("insert into {{entity.id}} ({{entity.mybatisSqlInsertColumns}}) values ({{entity.mybatisSqlInsertValues}})")
    int insert({{entity.capId}} {{entity.id}});

    //更新{{entity.name}}
    @Update(" update {{entity.id}} set {{entity.mybatisSqlUpdateSet}} where {{pk.id}}={{"#"}}{{{pk.id}}}")
    int update({{entity.capId}} {{entity.id}});

    //删除{{entity.name}}
    @Delete("delete from {{entity.id}} where {{pk.id}}={{"#"}}{{{pk.id}}}")
    int delete({{pk.type}} {{pk.id}});
}
