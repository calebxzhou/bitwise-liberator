package com.ssm.mapper;

import com.ssm.entity.*;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@Mapper
public interface ${entity.capId}Mapper {
    @Select("select * from ${entity.voTable}")
    List<${entity.voId}> selectAll();

    <#list entity.voFields as field>
    @Select("select * from ${entity.voTable} where ${field.id} = ${"#"}{${field.id}}")
    <#if entity.primaryKey == field>${entity.voId}<#else>List<${entity.voId}></#if> selectBy${field.capId}(${field.type} ${field.id});
    </#list>

    @Insert("insert into ${entity.id} (${entity.mybatisSqlInsertColumns}) values (${entity.mybatisSqlInsertValues})")
    int insert(${entity.capId} ${entity.id});

    @Update(" update ${entity.id} set ${entity.mybatisSqlUpdateSet} where ${entity.primaryKey.id}=${"#"}{${entity.primaryKey.id}}")
    int update(${entity.capId} ${entity.id});
    @Delete("delete from ${entity.id} where ${entity.primaryKey.id}=${"#"}{${entity.primaryKey.id}}")
    int delete(${entity.capId} ${entity.id});
}
