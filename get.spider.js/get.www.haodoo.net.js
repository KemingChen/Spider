var totalPage, haodooID, haodooIDContents;

function main(){
    cmd.showMsg("開始抓取 Haodoo 線上書");
    cmd.showMsg('請輸入Haodoo ID', initHaodooSpider);
}

function initHaodooSpider(obj){
    haodooID = $(obj).val();
    cmd.showMsg("搜尋該 {0} 的總頁數".format(haodooID));
    
    haodooIDContents = [];
    
    var param = {url: "http://www.haodoo.net/?M=u&P={0}:1".format(haodooID)};
    cmd.downloadFile("return.php", param, getHaodooIDTotalPages);
}

function getHaodooIDTotalPages(msg){
    if(msg == ""){
        cmd.showMsg("抓取 {0} 線上書失敗".format(haodooID));
        return;
    }
    totalPage = msg.match(/var maxChapterID = (\d+);/)[1];
    getHaodooIDContents();
}

function getHaodooIDContents(msg, param){
    if(!msg){
        cmd.showMsg("找到 {0} 頁面".format(totalPage));
        cmd.showMsg("搜尋頁面中所有的內容...");
        cmd.initProcess(totalPage, saveContents);
        for(var i=1; i<=totalPage; i++){
            var param = {url: "http://www.haodoo.net/?M=u&P={0}:{1}".format(haodooID, i)};
            cmd.downloadFile("return.php", param, getHaodooIDContents, {pageNumber: i});
        }
    }
    else{
        var pageNumber = param["pageNumber"];
        var content = msg.match(/<pre id="SourceText">([^]*)<\/pre>/)[1];
        content = content.replace(/︽/g, "《");
        content = content.replace(/︾/g, "》");
        content = content.replace(/﹁/g, "「");
        content = content.replace(/﹂/g, "」");
        content = content.replace(/︵/g, "（");
        content = content.replace(/︶/g, "）");
        content = content.replace(/｜/g, "—");
        console.log(pageNumber);
        haodooIDContents[pageNumber] = content;
        cmd.finishProcess();
    }
}

function saveContents(){
    var contents = "";
    for(var i=1; i<=totalPage; i++){
        contents += haodooIDContents[i] + "\r\n\r\n";
    }
    var param = {action: "SaveText", data: contents, filename: haodooID};
    cmd.downloadFile("database.php", param, finish, undefined, "POST");
}

function finish(){
    cmd.showMsg("抓取完成<a href='{0}' target='blank'>{0}</a>".format(haodooID));
}

main();