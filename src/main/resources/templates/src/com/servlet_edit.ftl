<#-- @ftlvariable name="entity" type="calebxzhou.codenliberate.model.Entity" -->
package com.servlet;

import java.io.IOException;
import java.sql.Timestamp;
import java.sql.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dao.*;
import com.model.*;

@WebServlet("/${entity.id}EditServlet")
public class ${entity.id}EditServlet extends HttpServlet {

    //跳转到${entity.name}的修改界面
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        //去数据库读取对应编号的数据，写到修改界面里
        ${entity.id} ${entity.asVar} = DAOFactory.get${entity.id}DAOInstance().doQueryById(req.getParameter("id"));
        req.setAttribute("${entity.asVar}",${entity.asVar});
        req.getRequestDispatcher("${entity.asVar}_edit.jsp").forward(req,resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        //创建新的${entity.name}对象
        ${entity.id} ${entity.asVar} = new ${entity.id}();
<#list entity.fields as field>
            //读取界面上的${field.name}内容
            ${field.type} ${field.id} = ${field.type}.valueOf(req.getParameter("${field.id}"));
            //把${field.name}写入到${entity.name}对象里
            ${entity.asVar}.set${field.capId}(${field.id});
</#list>
        //去数据库更新${entity.name}对象
        DAOFactory.get${entity.id}DAOInstance().doUpdate(${entity.asVar});
        //跳回查询${entity.name}全部信息界面
        req.getRequestDispatcher("${entity.id}QueryAllServlet").forward(req,resp);
    }
}