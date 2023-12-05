<jsp:useBean id="college_old" scope="session" type="com.ssm.entity.College"/>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form method="post" action="college_edit_do">
<label for="id">学院编号</label><input id="id" name="id" value="${college_old.id}"/><br>
<label for="name">学院名称</label><input id="name" name="name" value="${college_old.name}"/><br>
<button type="submit">提交</button>

</form>