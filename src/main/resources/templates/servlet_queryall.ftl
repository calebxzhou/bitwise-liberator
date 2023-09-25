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

//查询全部信息
@WebServlet("/${entity.id}QueryAllServlet")
public class ${entity.id}QueryAllServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        //去数据库读取全部信息
        List<${entity.id}> list = DAOFactory.get${entity.id}DAOInstance().doQueryAll();
        //存入list
        req.setAttribute("list",list);
        //跳到jsp
        req.getRequestDispatcher("${entity.asVar}_queryall.jsp").forward(req,resp);
    }
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,IOException {
        doGet(req,resp);
    }
}