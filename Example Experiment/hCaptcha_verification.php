<?php
    $DATA = [
        'secret'=> 'XXX', // enter your secret token here from your hCaptcha account
        'response'=> $_POST['hCaptcha_token']
    ];

    $CH = curl_init();
    $OPTIONS = array(
        CURLOPT_RETURNTRANSFER => true,   // return web page
        CURLOPT_URL => 'https://hcaptcha.com/siteverify',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($DATA)
    );
    curl_setopt_array($CH, $OPTIONS);
    $JSON_RESPONSE = curl_exec($CH);
    curl_close($CH);

    $RESULTS = json_decode($JSON_RESPONSE, true);
    if ($RESULTS['success']) {
        echo 'passed';
    } else {
        echo 'not working';
    }
?>
