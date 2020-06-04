package com.ruben.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @ClassName: PageController
 * @Description:
 * @Date: 2020/6/3 23:21
 * *
 * @author: achao<achao1441470436 @ gmail.com>
 * @version: 1.0
 * @since: JDK 1.8
 */
@Controller
public class PageController {
    @RequestMapping("{pages}")
    public String jump(@PathVariable("pages") String pages) {
        return pages;
    }
}
