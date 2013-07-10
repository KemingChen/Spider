<?
    $action = urldecode($_REQUEST["action"]);
    
    switch($action){
        case "SaveText":
            $filename = urldecode($_REQUEST["filename"]);
            $data = $_REQUEST["data"];
            file_put_contents($filename, $data);
            echo $action." ".$filename."<br />".$data;
            break;
    }
?>