<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="../examples/moviewatcher/manifest-app.json"/>
    <link rel="icon" sizes="192x192" href="../shared/images/icons/icon-4x.png">

    <link rel="stylesheet" href="../shared/css/icons/google_icons.css"/>
    <link rel="stylesheet" href="../shared/css/paper-bundle.css"/>
    <link rel="stylesheet" href="activities/css/app.css"/>

    <title>ModMaker</title>
</head>
<body>
    <?php
    //Include startup html
    include 'shared/inc/startup.php';

    //Include activities structure
    $files = array_diff(scandir("modmaker/activities/html"), array('..', '.'));
    foreach($files as $file){
        include "modmaker/activities/html/$file";
    }
    ?>

    <script src="../shared/js/jquery.min.js"></script>
    <script src="../shared/js/paper-bundle.js"></script>

    <script src="lang/en.js"></script>

    <!--
    Release bundle
    <script src="index/bundle.js"></script>
    -->
    <!--
    Debug scripts -->
    <script src="activities/js/_app.js"></script>
    <script src="activities/js/object-list.js"></script>
    <script src="activities/js/mod-drawer.js"></script>
    <script src="activities/js/_groups.js"></script>

</body>
</html>