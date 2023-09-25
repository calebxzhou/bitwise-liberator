<#assign DLR = "$">
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
<form class="row" method="GET" action="${entity.id}QueryAllServlet">

    <div class="col-2">
        <a href="${DLR}{pageContext.request.contextPath}/${entity.id}AddServlet">
            <button type="button" class="btn addBtn">添加${entity.name}</button>
        </a>
    </div>

    <div class="col-2">
        <select class="form-select" name="condition">
            <#list entity.fields as field>
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
        <#list entity.fields as field>
            <th scope="col">${field.name}</th>
        </#list>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${DLR}{list}" var="item">
      <tr>
          <#list entity.fields as field>
              <td>${DLR}{item.${field.id}}</td>
          </#list>
          <td>
              <a href="${entity.id}EditServlet?id=${DLR}{item.id}">
                  <button class="btn editBtn">
                      编辑
                  </button>

              </a>
              &emsp;
              <a href="${entity.id}DeleteServlet?id=${DLR}{item.id}">
                  <button class="btn delBtn">
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
