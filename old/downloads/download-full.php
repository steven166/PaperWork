<?php

require 'lib/JSMin.php';
require 'lib/CSSmin.php';

$css_min = new CSSmin();

//Prepare css and js
$module_list = array(
    "wrippels",
    "header",
    "drawer",
    "button",
    "button-float",
    "list",
    "input",
    "checkbox",
    "modal",
    "popup",
    "snackbar-toast"
);

$filename = getTempFile();

$css = "/*\n    Author: Steven Hermans\n*/\n";
$css_style = "";
$js = "/*\n    Author: Steven Hermans\n*/\n";

$css_file = "../css/material/paper.css";
if (file_exists($css_file)) {
    $content = file_get_contents($css_file);
    $css .= minify_css($content);
}
$css_style_file = "../css/styles/paper-styles.css";
if (file_exists($css_style_file)) {
    $content = file_get_contents($css_style_file);
    $css_style .= minify_css($content);
}
$js_file = "../js/material/paper.js";
if (file_exists($js_file)) {
    $js .= JSMin::minify(file_get_contents($js_file));
}

foreach ($module_list as $module) {
    $css_file = "../css/material/paper-$module.css";
    if (file_exists($css_file)) {
        $content = file_get_contents($css_file);
        $css .= minify_css($content);
    }
    $css_style_file = "../css/styles/paper-$module-styles.css";
    if (file_exists($css_style_file)) {
        $content = file_get_contents($css_style_file);
        $css_style .= minify_css($content);
    }
    $js_file = "../js/material/paper-$module.js";
    if (file_exists($js_file)) {
        $js .= JSMin::minify(file_get_contents($js_file));
    }
}

$css .= $css_style;

//Create zip
$zip = new ZipArchive();
if ($zip->open($filename, ZipArchive::CREATE) !== TRUE) {
    exit("cannot open <$filename>\n");
}
$zip->addFromString("material.css", $css);
$zip->addFromString("material.js", $js);
$zip->close();

//Retrun zip
header('Content-type: application/zip');
header('Content-Disposition: attachment; filename="Material-Design-full.zip"');
header("Content-length: " . filesize($filename));
readfile($filename);
$file = fopen('iplog.txt', 'a', 1);
$ipz = getenv("REMOTE_ADDR");
$text = "$ipz\n";
fwrite($file, $text);
fclose($file);

function getTempFile($i = 0) {
    $filename = "tmp/tmp_$i";
    if (file_exists($filename)) {
        return getTempFile($i + 1);
    } else {
        return $filename;
    }
}

function minify_css($css){
    $minify = false;
    if($minify){
        return $css_min->run($css);
    }else{
        return $css;
    }
}