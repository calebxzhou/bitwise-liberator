<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
    <style>
    </style>


</head>
<body>

<div class="container">
    <main>
        <div class="py-5 text-center">
            <h2>添加{{entity.name}}</h2>
        </div>

        <div class="row g-5">
            <div class="col-md-7 col-lg-8">
                <form method="POST" action="{{entity.capId}}_insert_do">
                    <div class="row g-3">
                        <#list entity.fields as field>
                            <div class="col-12">
                                <label for="{{field.id}}" class="form-label">{{field.name}}</label>
                                
                                        <input type="text" class="form-control" id="{{field.id}}" name="{{field.id}}"
                                               placeholder="{{field.name}}"  >
                            </div>
                        </#list>
                    </div>
                    <button class="w-100 btn btn-lg btn-primary" type="submit" >提交</button>
                </form>
            </div>
        </div>
    </main>


</div>
</body>

<script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script>


</html>
