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

@WebServlet("/${entity.id}DeleteServlet")
public class ${entity.id}DeleteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        DAOFactory.get${entity.id}DAOInstance().doDelete(req.getParameter("id"));
        //跳回信息查询界面
        req.getRequestDispatcher("${entity.id}QueryAllServlet").forward(req,resp);
    }

}