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