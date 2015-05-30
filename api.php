<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="shared/manifest-app.json"/>
    <link rel="icon" sizes="192x192" href="shared/images/icons/icon-4x.png">

    <link rel="stylesheet" href="shared/css/icons/google_icons.css"/>
    <link rel="stylesheet" href="shared/css/paper-bundle.css"/>
    <link rel="stylesheet" href="api/bundle.css"/>
    <title>Api | Paperwork</title>
</head>
<body>
<?php
//Include startup html
include 'shared/inc/startup.php';

//Include activities structure
$files = array_merge(array_diff(scandir("api/activities/html"), array('..', '.')), array_diff(scandir("shared/activities/html"), array('..', '.')));
foreach($files as $file){
    if(file_exists("api/$file")){
        include "api/activities/html/$file";
    }else{
        include "shared/activities/html/$file";
    }
}
?>

<script src="shared/js/jquery.min.js"></script>
<script src="shared/js/paper-bundle.js"></script>

<script src="shared/lang/en.js"></script>
<script src="api/lang/en.js"></script>

<script src="api/bundle.js"></script>

</body>
</html>