<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form method="post" action="college_insert_do">
    <#list entity.fields as field>
        ${field.name}
        <input name="${field.id}">
        <br>
    </#list>
    <button type="submit">提交</button>
</form>