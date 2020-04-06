<?php
  $subjNoFile = fopen($_POST['fileName'] . '.txt', 'r');
  $subjNo = fgets($subjNoFile) + 1;
  fclose($subjNoFile);

  $subjNoFile = fopen($_POST['fileName'] . '.txt', 'w');
  fwrite($subjNoFile, $subjNo); // write in subjNo file
  fclose($subjNoFile);
  echo $subjNo;
?>
