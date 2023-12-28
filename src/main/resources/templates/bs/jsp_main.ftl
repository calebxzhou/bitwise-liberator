<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<#assign DLR = "$">
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="home" viewBox="0 0 16 16">
        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
      </symbol>
    </svg>


    <style>

      iframe{
        width: 100%;
        height: 1080px;
      }
      body {
        min-height: 100vh;
        min-height: -webkit-fill-available;
      }

      html {
        height: -webkit-fill-available;
      }

      main {
        display: flex;
        flex-wrap: nowrap;
        height: 100vh;
        height: -webkit-fill-available;
        max-height: 100vh;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .b-example-divider {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .bi {
        vertical-align: -.125em;
        pointer-events: none;
        fill: currentColor;
      }

    </style>


  </head>
  <body>


<main>
  <div class="d-flex flex-column flex-shrink-0 p-3" id="navbar" style="width: 280px;">
    <a href="${DLR}{pageContext.request.contextPath}/main.jsp" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">

      <span class="fs-4" id="title">${project.name}</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <#list project.entityMap as entity>
        <li class="nav-item">
          <a href="#" class="nav-link text-white" onclick="jump('${entity.id}QueryAllServlet')"  aria-current="page">
            #*<svg class="bi me-2" width="16" height="16"><use xlink:href="#home"/></svg>*#
            <span>${entity.name}管理</span>
          </a>
        </li>
      </#list>

    </ul>
    <hr>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <svg class="bi me-2" width="32" height="32"><use xlink:href="#people-circle"></use></svg>
        <strong>Admin</strong>
      </a>
    </div>
  </div>

  <div class="b-example-divider"></div>
  <iframe src="welcome.jsp" scrolling="no"></iframe>

</main>
  </body>
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script>
  <script>
  //页面跳转
    function jump(src) {
      $('iframe').attr('src', "${DLR}{pageContext.request.contextPath}/" + src);
    }
    function showDropdown(dropDownDivId) {
      document.getElementById(dropDownDivId).classList.toggle("show");
    }

    (function () {
      'use strict'
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl)
      })
    })();


    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }

  </script>




</html>
