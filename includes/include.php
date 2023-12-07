<?php 
session_start();
require 'rb/rb.php';

R::setup( 'mysql:host=localhost; dbname=haircut', 'root', 'root' );

if (!R::testConnection()) {
    exit('Нет подключения к БД111');
}

function formatstr($str){
    $str = trim($str);
    $str = stripslashes($str);
    $str = htmlspecialchars($str);
    return $str;
}

?>
