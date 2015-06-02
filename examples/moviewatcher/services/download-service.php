<?php

header('Content-Type: application/json');
error_reporting(LOG_ERR);

$imdb = $_GET["imdb"];
if(!empty($imdb)){
    $html = file_get_contents("https://thepiratebay.am/search/" . $imdb);
    if($html){
        $result = array();

        $doc = new DOMDocument();
        $doc->loadHTML($html);
        $table = $doc->getElementById("searchResult");
        $trs = $table->childNodes;
        for($i = 0; $i < $trs->length; $i++){
            $tr = $trs->item($i);
            if($tr->nodeName == "tr"){
                $item = array();
                $tds = $tr->childNodes;
                for($j = 0; $j < $tds->length; $j++){
                    $td = $tds->item($j);

                    if($j +2 == $tds->length){
                        $item["leechers"] = $td->textContent;
                    }else if($j +4 == $tds->length){
                        $item["seeders"] = $td->textContent;
                    }else if($j +6 == $tds->length){
                        $title = $td->childNodes->item(1)->textContent;
                        $item["title"] = trim($title);
                        $lowerTitle = strtolower($title);
                        if(strpos($lowerTitle, "cam")){
                            $item["res"] = "CAM";
                        }else if(strpos($lowerTitle, "720p")){
                            $item["res"] = "720p";
                        }else if(strpos($lowerTitle, "1080p")){
                            $item["res"] = "1080p";
                        }else if(strpos($lowerTitle, "brrip") || strpos($lowerTitle, "bluray")){
                            $item["res"] = "BRRip";
                        }else if(strpos($lowerTitle, "hdrip")){
                            $item["res"] = "HDRip";
                        }else if(strpos($lowerTitle, "dvd")){
                            $item["res"] = "DVD";
                        }else if(strpos($lowerTitle, "x264")){
                            $item["res"] = "X264";
                        }else{
                            $item["res"] = null;
                        }

                        $link = $td->childNodes->item(3)->getAttribute("href");
                        $item["link"] = trim($link);
                        for($k = 0; $k < $td->childNodes->length; $k++){
                            $font = $td->childNodes->item($k);
                            if($font->nodeName == "font"){
                                $info = $font->textContent;
                                $infos = explode(", ", $info);
                                $size = explode(" ", $infos[1])[1];
                                $item["size"] = trim($size);
                                break;
                            }
                        }

                    }
                }
                $result[] = $item;
            }
        }

        echo json_encode($result);
    }else{
        http_response_code(400);
    }
}else{
    http_response_code(400);
}