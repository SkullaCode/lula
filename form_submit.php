<?php
$result = (isset($_GET['result'])) ? $_GET['result'] : 'random';
switch($result)
{
    case 'success'  : { http_response_code(200); break; }
    case 'fail'     : { http_response_code(500); break; }
    case 'random'   : {
        $vals = [200,500];
        http_response_code($vals[rand(0,1)]);
        break;
    }
}
header('Content-Type: application/json');
echo json_encode(["get" => $_GET, "post" => $_POST, "files" => $_FILES], JSON_PRETTY_PRINT);