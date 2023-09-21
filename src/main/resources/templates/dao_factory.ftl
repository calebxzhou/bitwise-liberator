<#-- @ftlvariable name="entity" type="calebxzhou.codenliberate.model.Entity" -->
package com.dao;

import java.sql.*;
import com.entity.*;
import java.util.*;
import com.dao.impl.*;

//数据工厂
public class DAOFactory{
    <#list entity.fields as field>
        //获取${entity.name}的数据访问对象
        public static ${entity.id}DAO get${entity.id}DAOInstance(){
            return new ${entity.id}DAOImpl();
        }
    </#list>

}