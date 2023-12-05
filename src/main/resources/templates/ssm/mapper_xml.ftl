<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.ssm.mapper.${entity.capId}Mapper">
    <select id="selectAll" resultType="com.ssm.entity.${entity.capId}">
        select * from ${entity.capId}
    </select>
    <select id="selectBy" parameterType="java.lang.String" resultType="com.ssm.entity.${entity.capId}">
        select * from ${entity.capId} where #{where}
    </select>
    <insert id="insert" parameterType="com.ssm.entity.${entity.capId}">
        insert into ${entity.capId} values (#{id},#{name})
    </insert>
    <update id="update" parameterType="map">
        update ${entity.capId} set id=#{new${entity.capId}.id},name=#{new${entity.capId}.name} where id=#{old${entity.capId}.id} and name=#{old${entity.capId}.name}
    </update>
    <delete id="delete" parameterType="com.ssm.entity.${entity.capId}">
        delete from ${entity.capId} where id=#{id} and name=#{name}
    </delete>
</mapper>