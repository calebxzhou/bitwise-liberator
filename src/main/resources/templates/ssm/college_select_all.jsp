<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="items" scope="request" type="java.util.List"/>
<button><a href="college_insert">添加学院</a></button>
<table>
    <thead>
    <tr>
        <th>学院编号</th>
        <th>学院名称</th>
    </tr>
    </thead>
    <tbody>

    <c:forEach items="${items}" var="var">
        <tr>
            <td>${var.id}</td>
            <td>${var.name}</td>
            <td>
                <a href="college_edit?id=${var.id}&name=${var.name}">
                    <button>编辑</button>
                </a>
            </td>
            <td>
                <a href="college_delete?id=${var.id}&name=${var.name}">
                    <button>删除</button>
                </a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
