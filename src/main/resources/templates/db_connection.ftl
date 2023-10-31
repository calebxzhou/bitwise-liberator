<#-- @ftlvariable name="project" type="calebxzhou.liberator.model.Project" -->
package com.dao;

import ${project.dbBrand.driverClass};

import java.util.*;
import java.sql.*;

public class DBConnection {
    private static final String dbDriver = "${project.dbBrand.driverClass}";
    private static final String dbUrl = "${project.dbBrand.localDbUrl}";
    private static final String dbName = "${project.dbBrand.dbAdminUsr}";
    private static final String dbPwd = "123456";
    private static Connection conn = null;

    public static Connection getConnection() {
        try {
            Class.forName(dbDriver);
            conn = DriverManager.getConnection(dbUrl, dbName, dbPwd);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return conn;
    }

    public static void close(){
        if(conn != null){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }

        }
    }


}