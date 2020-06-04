const baseUrl = 'http://localhost:52014';

const utils = {
    getUUID() { //生成UUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
        })
    },
    getSuffix(fileName) { //获取文件后缀名
        var first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
        var namelength = fileName.length;//取到文件名长度
        var filesuffix = fileName.substring(first + 1, namelength);//截取获得后缀名
        return `.${filesuffix}`
    },
    getfileName(fileName) { //获取文件名(不要后缀)
        var first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
        var filesuffix = fileName.substring(0, first);//截取获得文件名
        return `${filesuffix.replace(/\s/g, "")}`
    },
    getFileUrlName(fileName) { //获取文件路径名称
        var first = fileName.lastIndexOf("/");//取到文件名开始到最后一个/的长度
        var namelength = fileName.length;//取到文件名长度
        var filesuffix = fileName.substring(first + 1, namelength);//截取获得文件名
        return `${filesuffix}`
    },
    getObjectURL(file) {  //返回文件本地路径
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
}


function request(url, type, params = {}) {
    if (type == "URL_GET") {
        // console.log(params.url);

        url = url + '/' + params.url.join('/');
        delete (params['url']);
        type = 'GET';
    } else if (type == "URL_POST") {
        url = url + '/' + params.url.join('/');
        delete (params['url']);
        type = 'POST';
    }

    if (localStorage.getItem('token') && localStorage.getItem('refreshToken')) {
        params['headers'] = {//携带token
            "apiToken": localStorage.getItem('token'),
            "apiRefreshToken": localStorage.getItem('refreshToken')
        };
    }
    if (params['data'] && type == "POST") {
        params['data'] = JSON.stringify(params['data']);
    }

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: baseUrl + url,
            type: type,
            ...params,
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                if (res.code == 200) {
                    resolve(res)
                } else {

                }
            },
            error: function (res) {
                reject(res)
            }
        });
    })
}

function aliOssUploadFile(obj = {}) {
    // alert(obj);
    http.getOssInfo().then((res) => {
        if (res.code == 200 && res.success == true) {
            var config = res.data;
            var formData = new FormData();
            var filesAddress = `${config.dir}${utils.getfileName(obj.name)}-${utils.getUUID()}-${+new Date()}${utils.getSuffix(obj.name)}`;
            formData.append('key', filesAddress); //存储在oss的文件路径
            formData.append('ossaccessKeyId', config.accessid); //accessKeyId
            formData.append('policy', config.policy); //policy
            formData.append('Signature', config.signature); //签名
            formData.append("file", obj.file);
            formData.append("dir", config.dir);
            formData.append('success_action_status', 200); //成功后返回的操作码
            $.ajax({
                type: 'POST',
                data: formData,
                url: config.host,
                processData: false,
                contentType: false,
                async: true,
                xhr: function () {
                    myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // check if upload property exists
                        myXhr.upload.addEventListener('progress', (e) => {
                            var loaded = e.loaded;                  //已经上传大小情况
                            var total = e.total;                      //附件总大小
                            var percent = Math.floor(100 * loaded / total) + "%";     //已经上传的百分比
                            // console.log("已经上传了："+percent);
                            obj.success({
                                meCode: 201,
                                data: {total, loaded, percent: percent, num: Math.floor(100 * loaded / total)}
                            })
                        }, false); // for handling the progress of the upload
                    }
                    return myXhr;
                },
                success: (res) => {
                    obj.success({meCode: 200, data: {url: config.host + '/' + filesAddress}})
                },
                error: (err) => {
                    console.log(err);
                    obj.error({code: 200, success: false, msg: 'oss上传文件失败', data: err})
                }
            })
        } else {
            obj.error(res);
        }
    }).catch((err) => {
        obj.error({code: 200, success: false, msg: '获取oss签证失败', data: err});
    })
}

const http = {
    uploadFile: aliOssUploadFile, //阿里云oss上传文件
    getOssInfo: (params) => request('/oss/getMark', 'GET', params), //获取oss信息
}





// var firstShowImgs = true; //是否第一次调用setShowFiles()这个函数
// uploadFile input 框回调拿到的file对象
// for(var i=0;i<uploadFile.length;i++){ //循环push包装一下file对象
//   files.push({
//     returnShow: false, //当前图片是否上传完成
//     url: utils.getObjectURL(uploadFile[i]), //url 地址
//     file: uploadFile[i], //file 对象
//     isDel:false //是否删除
//   })
// }


// setShowFiles(0,files);

function setShowFiles(index, files) { //循环多文件上传
    if (index > files.length - 1) { //结束递归
        console.log(files);
        var arrImg = [];
        files.forEach(item => {
            if (item.returnShow == true && !item.isDel) {
                arrImg.push(item.url);
                item.isDel = true;
            }
        });
        console.log(arrImg); //结束递归时返回所有上传成功的url数组
        firstShowImgs = true; //改为初始值。
        return false
    }
    if (files[index].returnShow || files[index].isDel) {
        setShowFiles(index - 0 + 1, files); //递归下一个
        return false
    }
    http.uploadFile({ //上传
        file: files[index].file, //文件
        name: files[index].file.name, //文件名称
        success: (res) => { //成功返回
            if (res.meCode == 200) { //成功
                files[index].returnShow = true;
                files[index].url = res.data.url;
                setShowFiles(index - 0 + 1, files); //递归
            }
        },
        error: (err) => { //失败返回
            files[index].isDel = true; //，当前图片上传失败后改为删除状态就不得再次上传
            setShowFiles(index - 0 + 1, files); //递归下一个
            console.log(err);
        }
    })
}
