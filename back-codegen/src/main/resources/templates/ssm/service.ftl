//${entity.name}的服务类
package com.ssm.service;
<#assign pk = entity.primaryKey>
import com.ssm.entity.${entity.capId};
import com.ssm.mapper.${entity.capId}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ${entity.capId}Service {
    //自动注入数据库映射类
    @Autowired ${entity.capId}Mapper mapper;

    //选择所有${entity.name}
    public List<${entity.voId}> selectAll(){
        return mapper.selectAll();
    }
<#list entity.voFields as field>
    //按${field.name}选出${entity.name}
    public <#if pk == field>${entity.voId}<#else>List<${entity.voId}></#if> selectBy${field.capId}(${field.type} ${field.id}){
        return mapper.selectBy${field.capId}(${field.id});
    }
    <#if field.type == "Integer">
    //按${field.name}选出${entity.name}
    public <#if pk == field>${entity.voId}<#else>List<${entity.voId}></#if> selectBy${field.capId}(String ${field.id}){
        return mapper.selectBy${field.capId}(Integer.parseInt(${field.id}));
    }
    </#if>
</#list>
    //插入${entity.name}
    public boolean insert(${entity.capId} ${entity.id}){
        return 1 >= mapper.insert(${entity.id});
    }
    //更新${entity.name}
    public boolean update(${entity.capId} ${entity.id}){
        return 1 >= mapper.update(${entity.id});
    }
    //删除${entity.name}
    public boolean delete(${pk.type} ${pk.id}){
        return 1 >= mapper.delete(${pk.id});
    }
}
