<html>
    <head>
        <title>爬蟲~爬爬爬~~~</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="http://code.jquery.com/jquery-1.9.1.min.js" type="text/javascript"></script>
        <script src="string.js"></script>
        <script src="array.js"></script>
        <script src="cmd.js" type="text/javascript"></script>
    </head>
    <body>
        <div>
            <button onclick="cmd.addScript('getBookInfo.js')">GetBookInfo</button>
            <button onclick="cmd.clearMsg()">ClearConsole</button>
        </div>
        <div id="console"></div>
        <div id="process"></div>
        <script>var cmd = new Cmd("console", "process");</script>
    </body>
</html>