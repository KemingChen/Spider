var urls = [];
var go;

function main(){
    cmd.showMsg("開始抓取博客來書籍");
    getCategoryList();
}

function getCategoryList(msg){
    if(!msg){
        cmd.showMsg("搜尋類別...");
        cmd.initProcess(1, getBookPageList);
        var param = {url: "http://www.books.com.tw/exep/prod/books/eight_type/newbooksleague_eighttype.php?sub=02&encoding=C"};
        cmd.downloadFile("return.php", param, getCategoryList);
    }
    else{
        var result = msg.match(/newbooksleague_eighttype.php\?sub=\d+&encoding=C/g).getUnique();
        for(var i=0; i<result.length; i++){
            urls.push("http://www.books.com.tw/exep/prod/books/eight_type/" + result[i]);
        }
        cmd.finishProcess();
    }
}

function getBookPageList(msg){
    if(!msg){
        cmd.showMsg("找到 {0} 筆類別".format(urls.length));
        cmd.showMsg("搜尋類別中所有頁面...");
        cmd.initProcess(urls.length, getBookList);
        while(urls.length>0){
            var url = urls.pop();
            var param = {url: url};
            cmd.downloadFile("return.php", param, getBookPageList);
        }
    }
    else{
        var result = msg.match(/newbooksleague_eighttype.php\?sub=\d+&page=\d+&encoding=C/g);
        var lastPageUrl = result[result.length-1];
        var totalPage = lastPageUrl.match(/page=(\d+)/)[1];
        for(var i=1; i<=totalPage; i++){
            var tUrl = lastPageUrl.replace(/page=\d+/, "page="+i);
            urls.push("http://www.books.com.tw/exep/prod/books/eight_type/" + tUrl);
        }
        cmd.finishProcess();
    }
}

function getBookList(msg){
    if(!msg){
        cmd.showMsg("找到 {0} 筆頁面".format(urls.length));
        cmd.showMsg("搜尋頁面中所有的書...");
        cmd.initProcess(urls.length, getBookInfo);
        while(urls.length>0){
            var url = urls.pop();
            var param = {url: url};
            cmd.downloadFile("return.php", param, getBookList);
        }
    }
    else{
        var result = msg.match(/booksfile.php\?item=\d+/g).getUnique();
        var category = msg.match(/<title>.*&gt;(.*)&gt;.*&gt;.*<\/title>/)[1];
        for(var i=0; i<result.length; i++){
            var urlObject = {
                url: "http://www.books.com.tw/exep/prod/" + result[i],
                category : category
            };
            urls.push(urlObject);
        }
        cmd.finishProcess();
    }
}

function getBookInfo(msg, param){
    if(!msg){
        cmd.showMsg("找到 {0} 筆書".format(urls.length));
        cmd.showMsg("開始抓取書籍資料...");
        cmd.initProcess(urls.length);
        //while(urls.length>0){
            var urlObj = urls.pop();
            var param = {url: urlObj["url"]};
            cmd.downloadFile("return.php", param, getBookInfo, urlObj);
        //}
    }
    else{
        var book = {
            category: param["category"],
            name: msg.match(/<title>.*&gt;(.*)<\/title>/),
            author: msg.match(/作者：<a.*>(.*)<\/a>/),
            translator: msg.match(/繪者：<a.*>(.*)<\/a>/),
            publisher: msg.match(/出版社：<a.*>(.*)<\/a>/),
            publishDate: msg.match(/出版日期：<dfn>(\d+)年(\d+)月(\d+)日<\/dfn>/),
            isbn: msg.match(/ISBN：.*<dfn>(.*)<\/dfn>/),
            price: msg.match(/定價：.*<u>(\d+)<\/u>.*<\/dfn>/),
            cover: msg.match(/image.php\?image=(.*)&/),
            description: msg.match(/<table.*>[^]*<td>([^]*)<\/td>[^]*<\/table>/)
        };
        book = dealBook(book);
        cmd.log(book);
        cmd.finishProcess();
    }
}

function dealBook(book){
    var dealItem = ["name", "author", "translator", "publisher", "isbn", "price", "cover", "description"];
    for(var key in book){
        if(dealItem.inArray(key)){
            if(book[key]!=null){
                book[key] = book[key][1];
            }
        }
    }
    var publishDate = book["publishDate"];
    book["publishDate"] = "{0}-{1}-{2}".format(publishDate[1], publishDate[2], publishDate[3]);
    book["description"] = book["description"].replace(/[\r\n]/g, "");
    return book;
}

main();