package com.ssm.service;

import com.ssm.entity.${entity.capId};
import com.ssm.mapper.${entity.capId}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ${entity.capId}Service {
    @Autowired ${entity.capId}Mapper mapper;

    public List<${entity.voId}> selectAll(){
        return mapper.selectAll();
    }
<#list entity.voFields as field>
    public
    <#if entity.primaryKey == field>
    ${entity.voId}
<#else>
    List<${entity.voId}>
</#if> selectBy${field.capId}(${field.type} ${field.id}){
        return mapper.selectBy${field.capId}(${field.id});
    }
</#list>
    public boolean insert(${entity.capId} ${entity.uncapId}){
        return 1 >= mapper.insert(${entity.id});
    }
    public boolean update(${entity.capId} old${entity.capId},${entity.capId} new${entity.capId}){
        return 1 >= mapper.update(old${entity.capId}, new${entity.capId});
    }
    public boolean delete(${entity.capId} ${entity.uncapId}){
        return 1 >= mapper.delete(${entity.id});
    }
}
