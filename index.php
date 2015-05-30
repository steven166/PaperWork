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
    <link rel="stylesheet" href="shared/bundle.css"/>
    <link rel="stylesheet" href="index/activities/css/app.css"/>

    <title>PaperWork</title>
</head>
<body>
    <?php
    //Include startup html
    include 'shared/inc/startup.php';

    //Include activities structure
    $files = array_merge(array_diff(scandir("index/activities/html"), array('..', '.')), array_diff(scandir("shared/activities/html"), array('..', '.')));
    foreach($files as $file){
        if(file_exists("index/activities/html/$file")){
            include "index/activities/html/$file";
        }else if(file_exists("shared/activities/html/$file")){
            include "shared/activities/html/$file";
        }
    }
    ?>

    <script src="shared/js/jquery.min.js"></script>
    <script src="shared/js/paper-bundle.js"></script>

    <script src="shared/lang/en.js"></script>

    <!--
    Release bundle
    <script src="index/bundle.js"></script>
    -->
    <!--
    Debug scripts -->
    <script src="index/activities/js/_app.js"></script>
    <script src="index/activities/js/index.js"></script>
    <script src="index/activities/js/download-builder.js"></script>
    <script src="index/activities/js/get-started.js"></script>
    <script src="index/activities/js/_groups.js"></script>

</body>
</html>