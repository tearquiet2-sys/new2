<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    // Güvenli bir uygulamada, şifreler hash'lenerek veritabanında saklanmalıdır.
    // Bu sadece bir örnektir.
    if ($data->username === 'admin' && $data->password === 'admin123') {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $data->username;
        
        echo json_encode(["success" => true, "message" => "Giriş başarılı."]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Geçersiz kullanıcı adı veya şifre."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre gereklidir."]);
}
?>