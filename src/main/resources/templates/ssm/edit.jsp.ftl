<#assign S = "$">
<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="en">
<head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container">
        <main>
                <div class="py-5 text-center">
                        <h2>编辑${entity.name}</h2>
                </div>

                <div class="row g-5">
                        <div class="col-md-7 col-lg-8">
                                <form method="POST" action="${entity.capId}_edit_do">
                                        <div class="row g-3">
                                                <#list entity.fields as field>
                                                        <div class="col-12">
                                                                <label for="${field.id}" class="form-label">${field.name}</label>
                                                                <input type="text" class="form-control" id="${field.id}" name="${field.id}"
                                                                       placeholder="${field.name}" value="${S}{${entity.id}_old.${field.id}}" required
                                                                >
                                                        </div>
                                                </#list>

                                        </div>
                                        <button class="w-100 btn btn-lg btn-primary" type="submit">提交</button>
                                </form>
                        </div>
                </div>
        </main>
</div>
</body>
<script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script>
</html>
