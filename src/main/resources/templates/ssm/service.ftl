package com.ssm.service;

import com.ssm.entity.${entity.capId};
import com.ssm.mapper.${entity.capId}Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ${entity.capId}Service {
    @Autowired ${entity.capId}Mapper mapper;
    public List<${entity.capId}> selectAll(){
        return mapper.selectAll();
    }
    public List<${entity.capId}> selectBy(String where){
        return mapper.selectBy(where);
    }
    public boolean insert(${entity.capId} ${entity.id}){
        return 1 >= mapper.insert(${entity.id});
    }
    public boolean update(${entity.capId} old${entity.capId},${entity.capId} new${entity.capId}){
        return 1 >= mapper.update(old${entity.capId}, new${entity.capId});
    }
    public boolean delete(${entity.capId} ${entity.id}){
        return 1 >= mapper.delete(${entity.id});
    }
}
