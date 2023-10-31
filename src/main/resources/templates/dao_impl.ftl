<#-- @ftlvariable name="entity" type="calebxzhou.liberator.model.Entity" -->
package com.dao.impl;

import com.dao.*;
import com.entity.*;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.Timestamp;

public class ${entity.id}DAOImpl implements ${entity.id}DAO{
    private boolean flag = false;
    private Connection conn = DBConnection.getConnection();
    private PreparedStatement pstmt = null;
    private ResultSet rs = null;

<#list entity.fields as field>
    public List<${entity.id}> doSelectBy${field.capId}(${field.type} ${field.id}){
        List<${entity.id}> ${entity.id}List = new ArrayList<>();
        try{
            String sql = "select * from ${entity.id} where ${field.id}=?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1,${field.id});
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ${entity.id} ${entity.asVar} = new ${entity.id}();
                <#list entity.fields as field>
                    ${entity.asVar}.set${field.capId}(rs.${field.rsGet}("${field.id}"));
                </#list>
                ${entity.id}List.add(${entity.asVar});
            }
        } catch(Exception e){
            e.printStackTrace();
        } finally {
            try{
                pstmt.close();
                rs.close();
                conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
    }
</#list>


    public List<${entity.id}> doSelectAll() {
        List<${entity.id}> ${entity.id}List = new ArrayList<>();
        try {
            pstmt = conn.prepareStatement("select * from ${entity.id}");
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ${entity.id} ${entity.asVar} = new ${entity.id}();
                <#list entity.fields as field>
                    ${entity.asVar}.set${field.capId}(rs.${field.rsGet}("${field.id}"));
                </#list>
                ${entity.id}List.add(${entity.asVar});
            }

        } catch(Exception e){
            e.printStackTrace();
        } finally {
            try{
				pstmt.close();
				rs.close();
	            conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return ${entity.id}List ;

    }

    public boolean doUpdate(${entity.id} ${entity.asVar}) {
        try{
            String sql = "update ${entity.id} set ${entity.updateSql} where id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1,${entity.asVar}.getId());
            <#list 1..entity.fields?size as i>
                pstmt.set${entity.fields[i].pstSet}(${i},${entity.asVar}.get${entity.fields[i-1].id}());
            </#list>
            pstmt.setString($maxCount,${entity.asVar}.getId());
            int count = pstmt.executeUpdate();
            if(count>0){
                flag=true;
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                pstmt.close();
                conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return flag;
    }

    public boolean doCreate(${entity.id} ${entity.asVar}) {
        try{
            String sql = "insert into ${entity.id} values (${entity.insertPstmtValue})";
            pstmt = conn.prepareStatement(sql);
            <#list 0..entity.fields?size-1 as i>
                pstmt.set${entity.fields[i].pstSet}(${i},${entity.asVar}.get${entity.fields[i].id}());
            </#list>

            int count = pstmt.executeUpdate();
            if(count>0){
                flag=true;
            }
        }  catch(Exception e){
            e.printStackTrace();
        } finally {
            try{
				pstmt.close();
	            conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return flag;

    }

    public boolean doDelete(Integer id) {
        try{
            pstmt = conn.prepareStatement("delete from ${entity.id} where id=?");
            pstmt.setInt(1, id);
            int count = pstmt.executeUpdate();
            if(count>0){
                flag=true;
            }
        }  catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                pstmt.close();
                conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }

        return flag;



    }



}