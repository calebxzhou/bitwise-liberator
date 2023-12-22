package com.ssm.controller;

import com.ssm.entity.Systemuser;
import com.ssm.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    SystemuserService service;

    @GetMapping("/")
    public ModelAndView login(){
        return new ModelAndView("login");
    }
    @PostMapping("/login")
    public ModelAndView loginChk(HttpSession session,String id, String pwd) {
        Systemuser user;
        try {
            int iid = Integer.parseInt(id);
            user = service.selectBySystemuserId(iid);
        } catch (NumberFormatException e) {
            try {
                user = service.selectByUname(id).get(0);
            } catch (IndexOutOfBoundsException e1) {
                ModelAndView view = new ModelAndView("login");
                view.addObject("msg", "密码错误！");
                return view ;
            }
        }
        if(user == null) {
            ModelAndView view = new ModelAndView("login");
            view.addObject("msg", "密码错误！");
            return view ;
        }
        session.setAttribute("user", user);
        return new ModelAndView("main");
    }
    @GetMapping("/logout")
    public ModelAndView logout(HttpSession session) {
        session.invalidate();
        return new ModelAndView("main");
    }
    @GetMapping("/main")
    public ModelAndView main(HttpSession session){
        return new ModelAndView("main");
    }

}
