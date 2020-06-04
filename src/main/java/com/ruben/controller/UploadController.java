package com.ruben.controller;

import com.ruben.common.json.AjaxJson;
import com.ruben.service.UploadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName: UploadController
 * @Description: 文件上传controller
 * @Date: 2020/6/3 21:53
 * *
 * @author: achao<achao1441470436 @ gmail.com>
 * @version: 1.0
 * @since: JDK 1.8
 */
@RestController
@RequestMapping("oss")
public class UploadController {

    @Resource
    UploadService uploadService;

    /**
     * 获取签证
     *
     * @return
     */
    @GetMapping("getMark")
    public AjaxJson getMark() {
        return uploadService.getMark();
    }
}
