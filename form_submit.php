<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Method: GET,POST");
header("Access-Control-Allow-Headers: X-Requested-With");

if(strtolower($_SERVER['REQUEST_METHOD']) === 'options')
{
    http_response_code(200);
    die();
}

$result = (isset($_GET['result'])) ? $_GET['result'] : 'random';
switch($result)
{
    case 'success'      : { http_response_code(200); break; }
    case 'fail'         : { http_response_code(500); break; }
    case 'authorize'    : { http_response_code(403); break; }
    case 'random'       : {
        $vals = [200,500,401,403];
        http_response_code($vals[rand(0,3)]);
        break;
    }
}
header('Content-Type: application/json');
echo json_encode(["get" => $_GET, "post" => $_POST, "files" => $_FILES], JSON_PRETTY_PRINT);