package com.ssm.controller;

import com.ssm.entity.${entity.capId};
import com.ssm.service.${entity.capId}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class ${entity.capId}Controller {

    @Autowired
    ${entity.capId}Service service;

    @GetMapping("/${entity.id}_selectAll")
    public ModelAndView selectAll(){
        ModelAndView modelAndView = new ModelAndView("${entity.id}_select_all");
        modelAndView.addObject("items",service.selectAll());
        return modelAndView;
    }
    @GetMapping("/${entity.id}_edit")
    public ModelAndView edit(HttpSession session,${entity.capId} value){
        ModelAndView modelAndView = new ModelAndView("${entity.id}_edit");
        session.setAttribute("${entity.id}_old",value);
        return modelAndView;
    }
    @PostMapping("/${entity.id}_edit_do")
    public ModelAndView editDo(HttpSession session,${entity.capId} new${entity.capId}){
        ${entity.capId} old${entity.capId} = ((${entity.capId}) session.getAttribute("${entity.id}_old"));
        service.update(old${entity.capId},new${entity.capId});
        return selectAll();
    }
    @GetMapping("/${entity.id}_insert")
    public ModelAndView insert(){
        ModelAndView modelAndView = new ModelAndView("${entity.id}_insert");
        //关联...
        return modelAndView;
    }
    @PostMapping("/${entity.id}_insert_do")
    public ModelAndView insertDo(${entity.capId} ${entity.id}){
        service.insert(${entity.id});
        return selectAll();
    }
    @GetMapping("/${entity.id}_delete")
    public ModelAndView delete(${entity.capId} ${entity.id}){
        service.delete(${entity.id});
        return selectAll();
    }
}
