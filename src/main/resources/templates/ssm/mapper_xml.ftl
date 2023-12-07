<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ssm.mapper.${entity.capId}Mapper">
    <resultMap id="${entity.capId}Result" type="com.ssm.entity.${entity.capId}">
        <#list entity.mybatisFields as field>
            <#if field.primaryKey>
                <id property="${field.id}" column="${field.id}"/>
            </#if>
            <#if !field.primaryKey>
                <#if !field.hasRef>
                        <result property="${field.id}" column="${field.id}"/>
                    <#else>
                        <association property="${field.id}" column="${field.ref.getRefEntity(project).capId}_${field.ref.getRefEntity(project).primaryKey.id}" javaType="com.ssm.entity.${field.ref.getRefEntity(project).capId}" resultMap="${field.ref.getRefEntity(project).capId}Result"/>
                </#if>
            </#if>

        </#list>
    </resultMap>
    <select id="selectAll" resultMap="${entity.capId}Result">
        select * from ${entity.id}
    </select>
    <select id="selectOne" parameterType="java.lang.String" resultMap="${entity.capId}Result">
        select * from ${entity.id} where ${entity.primaryKey.id} = ${"#"}{pkValue}
    </select>
    <select id="selectBy" parameterType="java.lang.String" resultMap="${entity.capId}Result">
        select * from ${entity.id} where ${"#"}{where}
    </select>
    <insert id="insert" parameterType="com.ssm.entity.${entity.capId}">
        insert into ${entity.id} values (${entity.mybatisSqlInsertValues})
    </insert>
    <update id="update" parameterType="map">
        update ${entity.id} set ${entity.mybatisSqlUpdateSet} where ${entity.mybatisSqlUpdateWhere}
    </update>
    <delete id="delete" parameterType="com.ssm.entity.${entity.capId}">
        delete from ${entity.id} where ${entity.mybatisSqlDeleteWhere}
    </delete>
</mapper>