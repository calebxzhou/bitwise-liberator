
package com.dao

//${entity.NameCn} 数据访问对象接口
public interface ${entity.capEn()}DAO{
//按编号查询指定${entity.NameCn}的信息
public ${entity.getVoName()} doQueryById(String id);
#foreach($field in ${vo.getFieldsWithoutId()})
//按${field.NameCn}查询指定${vo.NameCn}的信息
public List<${entity.getVoName()}> doQueryBy${field.capEn()}(${field.getJavaType()} ${field.NameEn});
#end
//查询全部${vo.NameCn}的信息
public List<${entity.getVoName()}> doQueryAll();
//编辑${entity.NameCn}的信息
public boolean doUpdate(${entity.capEn()} ${entity.NameEn});
//插入${entity.NameCn}的信息
public boolean doCreate(${entity.capEn()} ${entity.NameEn});
//删除${entity.NameCn}的信息
public boolean doDelete(String id);


}