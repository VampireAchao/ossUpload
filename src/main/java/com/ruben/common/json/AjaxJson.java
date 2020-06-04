/**
 * Copyright &copy; 2015-2020 <a href="http://www.jeeplus.org/">JeePlus</a> All rights reserved.
 */
package com.ruben.common.json;

import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.jeeplus.core.mapper.JsonMapper;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;


/**
 * $.ajax后需要接受的JSON
 *
 * @author
 *
 */
public class AjaxJson extends HashMap<String,Object> implements Serializable {


	public AjaxJson(){
		this.put("success", true);
		this.put("code", HttpStatus.OK.value());
		this.put("msg", "操作成功");
	}

	public String getMsg() {
		return (String)this.get("msg");
	}

	public void setMsg(String msg) {//向json中添加属性，在js中访问，请调用data.msg
		this.put("msg", msg);
	}


	public boolean isSuccess() {
		return (boolean)this.get("success");
	}

	public void setSuccess(boolean success) {
		this.put("success", success);
	}

/*	@JsonIgnore//返回对象时忽略此属性
	public String getJsonStr() {//返回json字符串数组，将访问msg和key的方式统一化，都使用data.key的方式直接访问。

		String json = JsonMapper.getInstance().toJson(this);
		return json;
	}*/
	@JsonIgnore//返回对象时忽略此属性
	public static AjaxJson success(String msg) {
		AjaxJson j = new AjaxJson();
		j.setMsg(msg);
		return j;
	}
	@JsonIgnore//返回对象时忽略此属性
	public static AjaxJson error(String msg) {
		AjaxJson j = new AjaxJson();
		j.setSuccess(false);
		j.setMsg(msg);
		return j;
	}

	public static AjaxJson success(Map<String, Object> map) {
		AjaxJson restResponse = new AjaxJson();
		restResponse.putAll(map);
		return restResponse;
	}

	public static AjaxJson success() {
		return new AjaxJson();
	}


	@Override
	public AjaxJson put(String key, Object value) {
		super.put(key, value);
		return this;
	}

	public AjaxJson putMap(Map m) {
		super.putAll(m);
		return this;
	}

	public int getCode() {
		return (int)this.get("code");
	}

	public void setCode(int code) {
		this.put("code", code);
	}

}
