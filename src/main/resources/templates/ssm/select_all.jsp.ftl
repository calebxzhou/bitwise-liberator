<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="items" scope="request" type="java.util.List"/>
<button><a href="${entity.capId}_insert">添加学院</a></button>
<table>
    <thead>
    <tr>
        <#list entity.fields?values as field>
        <th>${field.name}</th>
        </#list>
    </tr>
    </thead>
    <tbody>

    <c:forEach items="${r"$"}{items}" var="var">
        <tr>
            <#list entity.fields?values as field>
                <td>${r"$"}{var.${field.id}}</td>
            </#list>
            <td>
                <a href="${entity.capId}_edit?${entity.jspHrefParam}">
                    <button>编辑</button>
                </a>
            </td>
            <td>
                <a href="${entity.capId}_delete?${entity.jspHrefParam}">
                    <button>删除</button>
                </a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
