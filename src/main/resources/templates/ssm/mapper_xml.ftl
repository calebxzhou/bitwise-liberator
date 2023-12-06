<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ssm.mapper.${entity.capId}Mapper">
    <resultMap id="${entity.id}Result" type="com.ssm.entity.${entity.capId}">
        <#list entity.fields as field>
            <#if field.primaryKey>
                <id property="${field.id}" column="${field.id}"/>
            <#elseif field.ref??>
                <association property="${field.id}"
                             column="${field.ref.parent.id}_${field.ref.id}" javaType="com.ssm.entity.${field.ref.parent.capId}" select="com.ssm.entity.${field.ref.parent.capId}Mapper.selectOne"/>
            <#else >
                <result property="${field.id}" column="${field.id}"/>
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