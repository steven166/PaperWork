<?php
error_reporting(null);
ob_start();

$filename = "paper-progress-styles.css";

$css_rules = array(
    ".theme-[color-name] .paper-progress *{background-color: [color];}",
    ".paper-progress.[color-name] *{background-color: [color];}"
);

$colors = array(
        red => "#F44336",
        pink =>  "#E91E63",
        purple=>  "#9C27B0",
        'deep-purple'=>  "#673AB7",
        indigo=>  "#3F51B5",
        blue=>  "#2196F3",
        'light-blue'=>  "#03A9F4",
        cyan=>  "#00BCD4",
        teal=>  "#009688",
        green=>  "#4CAF50",
        'light-green'=> "#8BC34A",
        lime=> "#CDDC39",
        yellow=> "#FFEB3B",
        amber=>  "#FFC107",
        orange=> "#FF9800",
        'deep-orange'=>  "#FF5722",
        brown=>  "#795548",
        gray=>  "#9E9E9E",
        'dark-gray'=> "#333333",
        'light-gray'=>  "#CCCCCC",
        'blue-gray'=>  "#607D8B",
        black=>  "black",
        white=>  "white",
        transparent=>  "rgba(0,0,0,0)");

foreach($css_rules as $rule){
    if(strpos($rule, "[color]") === 0 && strpos($rule, "[color-name]") === 0){
        echo $rule . "\n";
    }else{
        foreach($colors as $key => $value){
            echo str_replace("[color]", $value, str_replace("[color-name]", $key, $rule)) . "\n";
        }
    }
}

$done = file_put_contents($filename, ob_get_contents());
echo "\n\n--------------------------------\n";
echo "SUCCEED: " + $done;