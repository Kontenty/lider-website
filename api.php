<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');

$req = explode('/', $_SERVER['REQUEST_URI']);
$req[2] = explode('?', $req[2])[0];
$req = array_filter($req);

// if this API must be used with a GET, POST, PUT, DELETE or OPTIONS request
$requestMethod = $_SERVER['REQUEST_METHOD'];

// retrieve the inbound parameters based on request type.
if (in_array($requestMethod, ["GET", "OPTIONS"])) {
	
	switch ($req[2]) {
		case "img":
			try {
				echo file_get_contents($_GET['file']);
			} catch (Exception $e) {
				echo $e->getMessage();
				http_response_code(404);
			}			
			break;

		case "posts":
			try {
				$json = file_get_contents('http://wp.oncographene.com/wp-json/wp/v2/posts?_embed');
				echo $json;
			} catch (Exception $e) {
				echo $e->getMessage();
				http_response_code(404);
			}

			break;
		
		default:
			http_response_code(404);
			echo "wrong request";
			break;
	}
} else {
	http_response_code(405);
}
?>