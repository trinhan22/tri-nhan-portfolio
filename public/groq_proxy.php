<?php
header('Content-Type: application/json');

// Bảo mật 1: (Tùy chọn) Chỉ cho phép website của bạn truy cập file này
// header('Access-Control-Allow-Origin: https://www.fphotography.club'); 

// THAY API KEY GROQ CỦA BẠN VÀO ĐÂY
$groqApiKey = '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';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Chỉ cho phép POST request']);
    exit;
}

// Lấy dữ liệu gửi lên từ frontend
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
     http_response_code(400);
     echo json_encode(['error' => 'Dữ liệu không hợp lệ']);
     exit;
}

// Chuẩn bị dữ liệu gửi sang Groq
$payload = json_encode([
    'model' => 'llama-3.1-8b-instant', // Đổi dòng này thành model mới
    'messages' => [
        ['role' => 'system', 'content' => $data['systemPrompt'] ?? ''],
        ['role' => 'user', 'content' => $data['messages'] ?? '']
    ],
    'temperature' => 0.7 
]);

// Cấu hình kết nối CURL
$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $groqApiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

if(curl_errno($ch)){
    http_response_code(500);
    echo json_encode(['error' => 'Lỗi kết nối CURL: ' . curl_error($ch)]);
} else {
    // Trả kết quả JSON từ Groq thẳng về cho frontend
    echo $response;
}

curl_close($ch);
?>