<?php
$url = 'http://wp.oncographene.com/wp-json/wp/v2/posts?_embed';

try {
  $json = file_get_contents($url);
  echo $json;
} catch (Exception $e) {
  echo $e->getMessage();
  http_response_code(404);
}
?>