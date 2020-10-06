<?php
    header('Content-Type: text/plain');

    $contents = file_get_contents($_POST['directory_path'] . '/' . $_POST['file_name']);

    if(strpos($contents, $_POST['worker_id']) === FALSE)
    {
        echo '0';
    }
    else
    {
        echo '1';
    }
?>