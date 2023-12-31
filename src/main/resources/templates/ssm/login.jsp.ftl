<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<!doctype html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>欢迎登录${project.pjName}系统</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
    <style>
        html,body {
            height: 100%;
        }

        body {
            display: flex;
            align-items: center;
            padding-top: 40px;
            padding-bottom: 40px;
        }

        .form-signin {
            width: 100%;
            max-width: 330px;
            padding: 15px;
            margin: auto;
        }



        .form-signin .form-floating:focus-within {
            z-index: 2;
        }


        .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    </style>
</head>
<body class="text-center">

<main class="form-signin">
        <h1 class="h3 mb-3 fw-normal">欢迎登录${project.pjName}</h1>
    <form action="login" method="post">
        <div class="form-floating">
            <input name="id" type="text" class="form-control" id="id" placeholder="用户名" required >
            <label for="id"><b>用户名</b></label>
        </div>
        <div class="form-floating">
            <input name="pwd" type="password" class="form-control" id="pwd" placeholder="密码" required >
            <label for="pwd"><b>密码</b></label>
        </div>

        ${"$"}{msg}
        <button class="w-100 btn btn-lg btn-primary" id="login" type="submit">登录</button>
    </form>
</main>
</body>
<script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script>
<script>
    function checkEs6() {
        "use strict";

        try { eval("let foo = (x)=>x+1"); }
        catch (e) { return false; }
        return true;
    }

    if (!checkEs6()) {
        alert('本页面只能用微软Edge浏览器、谷歌浏览器、火狐浏览器打开！');
    }
</script>
</html>
