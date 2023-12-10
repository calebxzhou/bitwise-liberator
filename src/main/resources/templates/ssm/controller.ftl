package com.ssm.controller;

import com.ssm.entity.*;
import com.ssm.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
//${entity.name}的控制器类
@Controller
public class ${entity.capId}Controller {

    @Autowired
    ${entity.capId}Service service;
<#list entity.refEntites as refEntity>
    @Autowired
    ${refEntity.capId}Service ${refEntity.id}Service;
</#list>

    @GetMapping("/${entity.capId}_selectAll")
    public ModelAndView selectAll(){
        ModelAndView modelAndView = new ModelAndView("${entity.capId}_select_all");
        modelAndView.addObject("items",service.selectAll());
        return modelAndView;
    }

    @GetMapping("/${entity.capId}_edit")
    public ModelAndView edit(${entity.capId} ${entity.id}){
        ModelAndView modelAndView = new ModelAndView("${entity.capId}_edit");
        modelAndView.addObject("${entity.id}",${entity.id});
<#list entity.refEntites as refEntity>
        modelAndView.addObject("all${refEntity.capId}",${refEntity.id}Service.selectAll());
</#list>
        return modelAndView;
    }
    @PostMapping("/${entity.capId}_edit_do")
    public ModelAndView editDo(${entity.capId} ${entity.id}){
        service.update(${entity.id});
        return selectAll();
    }
    @GetMapping("/${entity.capId}_insert")
    public ModelAndView insert(){
        ModelAndView modelAndView = new ModelAndView("${entity.capId}_insert");
<#list entity.refEntites as refEntity>
        modelAndView.addObject("all${refEntity.capId}",${refEntity.id}Service.selectAll());
</#list>
        return modelAndView;
    }
    @PostMapping("/${entity.capId}_insert_do")
    public ModelAndView insertDo(${entity.capId} ${entity.id}){
        service.insert(${entity.id});
        return selectAll();
    }
    @GetMapping("/${entity.capId}_delete")
    public ModelAndView delete(${entity.primaryKey.type} ${entity.primaryKey.id}){
        service.delete(${entity.primaryKey.id});
        return selectAll();
    }
}
