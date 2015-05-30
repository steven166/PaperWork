<?php

$modules = array(
    "paper",
    "paper-wrippels",
    "paper-list",
    "paper-header",
    "paper-app",
    "paper-input",
    "paper-button",
    "paper-checkbox",
    "paper-lang",
    "paper-modal",
    "paper-snackbar-toast"
);

ob_start();

foreach($modules as $module){
    $file = "../shared/js/paper/$module.js";
    if(file_exists($file)){
        $content = file_get_contents($file);
        $content = trim($content) . "\n";
        echo $content;
    }
}

file_put_contents("../shared/js/paper-bundle.js", ob_get_contents());

echo "------ CSS ------";


ob_clean();

foreach($modules as $module){
    $file = "../shared/css/paper/$module.css";
    if(file_exists($file)){
        $content = file_get_contents($file);
        $content = trim($content) . "\n";
        echo $content;
    }
}
foreach($modules as $module){
    $style_file = "../shared/css/paper/styles/$module-styles.css";
    if(file_exists($style_file)){
        $content = file_get_contents($style_file);
        $content = trim($content) . "\n";
        echo $content;
    }
}

file_put_contents("../shared/css/paper-bundle.css", ob_get_contents());