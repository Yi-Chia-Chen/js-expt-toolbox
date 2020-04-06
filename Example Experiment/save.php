<?php
  $dataFile = fopen($_POST['id'] . ".txt", 'a');
  fwrite($dataFile, $_POST['curData']); // append data from the subject
  fclose($dataFile);
?>
