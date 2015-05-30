<?php

$source_javascript = "../../shared/js/paper/";
$source_css = "../../shared/css/paper/";
$tmp_folder = "../temp";
$minify = true;
if(isset($_GET["minify"]) && $_GET["minify"] === "off"){
    $minify = false;
}

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

//Find temp file
if(!file_exists($tmp_folder)) {
    mkdir($tmp_folder);
}
$tmp_file_1_id = findTempFile();
$tmp_file_1 = $tmp_folder . "/" . md5("random" . $tmp_file_1_id) . ".zip";
$tmp_file_2_id = findTempFile($tmp_file_1_id+1);
$tmp_file_2 = $tmp_folder . "/" . md5("random" . $tmp_file_2_id) . ".zip";
echo $tmp_file_1 . "\n$tmp_file_2\n";

//Create zip file
$zip = new ZipArchive();
if($zip->open($tmp_file_1, ZipArchive::CREATE) !== true){
    throw new Exception("Cannot create zip '$tmp_file_1'");
}

//Bundel PaperWork javascript
copy($source_javascript . "paper.js", $tmp_file_2);

foreach($modules as $module){
    if($module !== "paper" && isset($_GET["module-" . $module]) && $_GET["module-" . $module] === "on"){
        $source_javascript_file = $source_javascript . $module . ".js";
        if(file_exists($source_javascript_file)) {
            appendJavascript($source_javascript_file, $tmp_file_2, $minify);
        }
    }
}
if(!file_exists($tmp_file_2)){
    throw new Exception("Javascript file '$tmp_file_2' doesn't exists");
}

$zip->addFile("/paperwork.js", $tmp_file_2);

if($zip->numFiles == 0){
    throw new Exception("Zip is empty");
}

$zip->close();

if(!file_exists($tmp_file_1)){
    throw new Exception("Zip file not created '$tmp_file_1'");
}


//header('Content-Type: application/zip');
//header('Content-disposition: attachment; filename=PaperWork.zip');
//header('Content-Length: ' . filesize($tmp_file_1));

readfile($tmp_file_1);
//unlink($tmp_file_1);




function appendJavascript($inputfile, $outputfile, $minify){
    $buffersize = 1024;
    $input_handle = fopen($inputfile, "rb");
    $output_handle = fopen($outputfile, "a");
    while (!feof($input_handle)) {
        $content = fread($input_handle, $buffersize);
        fwrite($output_handle, $content);
    }
    fclose($input_handle);
    fclose($output_handle);
}

function findTempFile($i = 1){
    global $tmp_folder;
    $filename = $tmp_folder . "/" . md5("random" . $i) . ".zip";
    if(file_exists($filename)){
        return findTempFile($i+1);
    }
    return $i;
}