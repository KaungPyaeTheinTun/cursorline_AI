<?php

return [
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => false,
    'domain' => env('COOKIE_DOMAIN'),
    'path' => '/',
    'secure' => env('COOKIE_SECURE', false),
    'http_only' => true,
    'same_site' => 'lax',
    'partitioned' => false,
];
