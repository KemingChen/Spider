<?
    $url = urldecode($_REQUEST["url"]);
    echo file_get_contents($url);
?>