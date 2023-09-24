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

@WebServlet("/${entity.id}AddServlet")
public class ${entity.id}AddServlet extends HttpServlet {

    //跳转到${entity.name}的添加界面
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        //跳转
        req.getRequestDispatcher("${entity.asVar}_add.jsp").forward(req,resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        //创建一个新的${entity.name}对象
        ${entity.id} ${entity.asVar} = new ${entity.id}();
        <#list entity.fields as field>
            //从表单中读取${field.name}数据
            //给${entity.name}的${field.name}赋值
            ${entity.asVar}.set${field.capId}(${field.type}.valueOf(req.getParameter("${field.id}")));
        </#list>
        //存入数据库
        if(DAOFactory.get${entity.id}DAOInstance().doCreate(${entity.asVar})){
            //跳回列表
            req.getRequestDispatcher("${entity.id}QueryAllServlet").forward(req,resp);
        }
    }
}