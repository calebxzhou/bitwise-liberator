<#assign $ = "$">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<h2 class="m-3">${entity.name}管理</h2>
    <div class="col-2">
        <a href="${$}{pageContext.request.contextPath}/${entity.capId}_insert">
            <button type="button" class="btn btn-primary">添加${entity.name}</button>
        </a>
    </div>

    <form method="get" action="${entity.capId}_selectAll">
    <div class="col-2">
        <select class="form-select" name="by">
            <#list entity.voFields as field>
                <option value="${field.id}">${field.name}</option>
            </#list>
        </select>
    </div>
    <div class="col">
        <input name="value" class="form-control">
    </div>
    <div class="col">
        <button type="submit" class="btn editBtn">搜索${entity.name}</button>
    </div>

    </form>


<div class="table-responsive">
    <table class="table table-striped table-sm">
        <thead>
        <tr>
            <#list entity.voFields as field>
                <th scope="col">${field.name}</th>
            </#list>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${$}{items}" var="var">
            <tr>
                <#list entity.voFields as field>
                    <td>${$}{var.${field.id}}</td>
                </#list>
                <td>
                    <a href="${entity.capId}_edit?${entity.jspHrefParam}">
                        <button class="btn btn-primary">
                            编辑
                        </button>

                    </a>
                    <a href="${entity.capId}_delete?${entity.primaryKey.id}=${$}{var.${entity.primaryKey.id}}">
                        <button class="btn btn-danger">
                            删除
                        </button>
                    </a>
                </td>
            </tr>
        </c:forEach>

        </tbody>
    </table>
</div>
</body>
<script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script></html>
