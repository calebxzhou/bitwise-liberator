package com.ssm.controller;

import com.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

        @Autowired
        UserService service;

        @GetMapping("/")
        public ModelAndView login(){
            return new ModelAndView("login");
        }
        @GetMapping("/main")
        public ModelAndView main(HttpSession session){
            return new ModelAndView("main");
        }

}
