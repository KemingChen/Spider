var Cmd = function(iConsole, iProcess){
    var br = "<br />";
    var myConsole = $("#{0}".format(iConsole));
    var myProcess = $("#{0}".format(iProcess));
    var myProcessTotal;
    var myProcessNow;
    var myProcessCallback;
    var scriptPath = [];
    var lastFile;
    
    this.showMsg = function(msg, callback){
        callback = callback === undefined ? undefined : callback.toString().match(/function (\w+)/)[1];
        input = callback === undefined ? "" : ': <input type="text" onKeyDown="javascript: if(event.keyCode==13){$(this).attr(\'disabled\', \'true\');'+callback+'(this);}" />';
        myConsole.append(msg + input + br);
    }
    
    this.clearMsg = function(){
        scriptPath = [];
        myConsole.empty();
        myProcess.empty();
    }
    
    this.initProcess = function(total, callback, init){
        myProcessTotal = total;
        myProcessNow = init || 0;
        myProcessCallback = callback || null;
        this.showProcess();
    }
    
    this.finishProcess = function(){
        myProcessNow += 1;
        this.showProcess();
        if(myProcessNow == myProcessTotal && myProcessCallback != null){
            myProcessCallback();
        }
    }
    
    this.showProcess = function(){
        var now = myProcessNow;
        var total = myProcessTotal;
        myProcess.empty();
        if(now != total)
            myProcess.append("{0}/{1} ({2}%)".format(now, total, Math.floor(now/total*100)));
    }
    
    this.downloadFile = function(url, param, callback, callbackParam, method){
        method = method || "GET";
        $.ajax({
            type: method,
            url: url,
            data: param
        }).done(function(msg) {
            lastFile = msg;
            console.log(callbackParam);
            if(callback)
                callback(msg, callbackParam);
        });
    }
    
    this.getLastFile = function(){
        return lastFile;
    }
    
    this.addScript = function(path){
        if(!scriptPath.inArray(path))
        {
            this.showMsg('Load {0} … [OK]'.format(path));
            scriptPath.push(path);
            $("body").append($("<script />", {
                src: "get.spider.js/"+path
            }));
        }
        else
        {
            this.showMsg('Load {0} … [Repeat]'.format(path));
        }
    }
    
    this.log = function(msg){
        console.log(msg);
    }
}