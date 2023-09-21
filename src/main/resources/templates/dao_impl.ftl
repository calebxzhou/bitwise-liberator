<#-- @ftlvariable name="entity" type="calebxzhou.codenliberate.model.Entity" -->
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



#foreach($field in ${vo.getFieldsWithoutId()})
    public List<${entity.vo}> doSelectBy${field.id}(${field.getJavaType()} ${field.NameEn}) {
        List<${entity.vo}> all${entity.vo} = new ArrayList<>();
        try {
            String sql = "select * from ${entity.vo} where ${field.NameEn}=?";
            pstmt = conn.prepareStatement(sql);
            pstmt.${field.getPstmtMethod()}(1,${field.NameEn});
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ${entity.vo} ${entity.voFieldId} = new ${entity.vo}();
                #foreach( $field in $vo.Fields )
                ${entity.voFieldId}.set${field.id}(rs.${field.getResultSetGetMethod()}("$field.NameEn"));
                #end
                all${entity.vo}.add(${entity.voFieldId});
            }
        } catch(Exception e){e.printStackTrace();}finally {try{
				pstmt.close();
				rs.close();
	            conn.close();
}catch(Exception e){e.printStackTrace();}
		}

        return all${entity.vo};


    }
#end

    public List<${entity.vo}> doSelectAll() {
        List<${entity.vo}> ${entity.vo}List = new ArrayList<>();
        try {
            pstmt = conn.prepareStatement("select * from ${entity.vo}");
            rs = pstmt.executeQuery();
            while (rs.next()) {
                ${entity.vo} ${entity.voFieldId} = new ${entity.vo}();
                <#list entity.fields as field>
                    ${entity.voFieldId}.set${field.capId}(rs.getObject("${field.id}"));
                </#list>
                ${entity.vo}List.add(${entity.voFieldId});
            }

        }  catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
				pstmt.close();
				rs.close();
	            conn.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return ${entity.vo}List ;

    }

    public boolean doUpdate(${entity.id} ${entity.asFieldId}) {
        try{
            String sql = "update ${entity.id} set ${entity.updateSql} where ${entity.whereSql}";
            pstmt = conn.prepareStatement(sql);
            <#list 1..entity.fields?size as i>
                pstmt.setObject(${i},${entity.asFieldId}.get${entity.fields[i].id}());
            </#list>
            <#list 0..entity.fields?size-1 as i>
                <#assign index = entity.fields?size+i>
                pstmt.setObject(${index},${entity.asFieldId}.get${entity.fields[i].id}());
            </#list>
            pstmt.setString($maxCount,${entity.NameEn}.getId());
            int count = pstmt.executeUpdate();
            if(count>0){
                flag=true;
            }

        }catch(Exception e){e.printStackTrace();}finally {try{
                        pstmt.close();
                        conn.close();
}catch(Exception e){e.printStackTrace();}
        }
        return flag;
    }

    public boolean doCreate(${entity.id} ${entity.asFieldId}) {
        try{
            String sql = "insert into ${entity.id} values (${entity.getInsertStatement()})";
            pstmt = conn.prepareStatement(sql);
            <#list 0..entity.fields?size-1 as i>
                pstmt.setObject($foreach.count,${entity.NameEn}.get${field.id}());
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