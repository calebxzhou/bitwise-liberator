package com.ssm.mapper;

import com.ssm.entity.${entity.capId};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface ${entity.capId}Mapper {
    List<${entity.capId}> selectAll();
    List<${entity.capId}> selectBy(String where);
    int insert(${entity.capId} ${entity.id});
    int update(@Param("old${entity.capId}") ${entity.capId} old${entity.capId},@Param("new${entity.capId}") ${entity.capId} new${entity.capId});
    int delete(${entity.capId} ${entity.id});
}
