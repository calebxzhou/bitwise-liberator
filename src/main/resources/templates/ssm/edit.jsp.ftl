<jsp:useBean id="college_old" scope="session" type="com.ssm.entity.College"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form method="post" action="${entity.id}_edit_do">
    <#list entity.fields as field>
        ${field.name}
        <input name="${field.id}" value="${r"$"}{${entity.id}_old.${field.id}}">
        <br>
    </#list>
<button type="submit">提交</button>

</form>