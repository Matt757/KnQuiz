<?php

function insertDefaultAnswerList()
{
    $codform = "<ul style='display: none' id='answers'>";
    $codform .= "<li id='answerLi1' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer1' id='answerContainer1'><i style='margin-right: 1vw' class='fa-solid fa-arrows-up-down'></i><input autocomplete='off' size='80' class='answer' name='answer1' value=''>";
    $codform .= "<button type=button style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(1, 1)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
    $codform .= "<input type='checkbox' onclick='uncheckAnswers(1)' class='correct' id='correct1' name='correct1' value='correct'>";
    $codform .= "<label class='correct_label' for='correct1'>Correct</label></div></li>";
    $codform .= "<li id='answerLi2' class='answerLi' style='padding: 0.5vw;'><div class='answerContainer' name='answerContainer2' id='answerContainer2'><i style='margin-right: 1vw' class='fa-solid fa-arrows-up-down'></i><input autocomplete='off' size='80' class='answer' name='answer2' value=''>";
    $codform .= "<button type=button style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(1, 1)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
    $codform .= "<input type='checkbox' onclick='uncheckAnswers(2)' class='correct' id='correct2' name='correct2' value='correct'>";
    $codform .= "<label class='correct_label' for='correct2'>Correct</label></div></li>";
    $codform .= "</ul>";
    $codform .= "<div style='display: none' id='addNewAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(1); return false' counter='2' name='addNewAnswer' id='addNewAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    $codform .= "<div id='crosswordContainer' style='padding: 0.5vw; width:fit-content; display: none'><label for='crosswordAnswers'>" . __('Write the crossword solution here', 'knq') . ":</label><textarea rows='5' cols='100' id='crosswordAnswers' name='crosswordAnswers'></textarea><br><label for='crosswordRightColumn'>" . __('On which column is the result of the crossword', 'knq') . "?</label><input type='number' min='1' id='crosswordRightColumn' name='crosswordRightColumn' value=''></div>";
    return $codform;
}

function insertDefaultSingleAnswer()
{
    return "<div style='display:none;' id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer''></textarea><p id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p><div style='display: none' id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><br><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div><p id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar (pipe), the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</strong></p></div>";
}

function insertDefaultImageAnswers()
{
    return "<div style='display:none;' id='imagesContainer'><button class='button button-primary' id='selectImages' type='button'>Select Images</button><br><div id='imageWidthContainer'><label for='imageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='imageWidth' name='imageWidth' type='number' value='10'><label for='imageWidth'>%</label></div></div>";
}

function insertDefaultWordSearch()
{
    $codform = "<div style='display: none' id='wordSearch'>";
    $codform .= '<div style="display: flex"><div class="searchAreaContainer" id="searchAreaContainer1"><textarea style="font-family: Courier New;" rows="12" cols="12" autocomplete="off" id="spaceSearch1" name="spaceSearch1" class="spaceSearch"></textarea><br><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: auto; margin-right: auto; display: block" onclick="deleteAnswer(1,8)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>';
    $codform .= "<div style='display: none' id='addNewWordSearchAnswerContainer'>" . __("To add a new word search area, click here", "knq") . ": <button onclick='newAnswer(8); return false' counter='2' name='addNewWordSearchAnswer' id='addNewWordSearchAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    $codform .= '<p>' . __('Words to be searched, separated by one space', 'knq') . '.<br><input autocomplete="off" type="text" id="wordsSearch" name="wordsSearch" size="80" value=""></p>';
    $codform .= '<p>' . __('If unused letters forms a message, please write it below', 'knq') . ':<br><input type="text" id="restLit" name="restLit" size="80" value=""></p>';
    $codform .= "</div>";
    return $codform;
}

function insertDefaultMatching()
{
    $codform = '<div style="display: none" id="matching">';
    $codform .= '<div style="width: 50%" id="answerColumnWidthContainer"><label for="answerColumnWidth">' . __('First column width:', 'knq') . ': </label><input id="answerColumnWidth" name="answerColumnWidth" min="1" max="100" type="number" value="50"><label for="answerColumnWidth">%</label></div>';
    $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer1" id="matchingContainer1"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer1" value="option1"><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect1" value="option1"><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(1,11)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
    $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer2" id="matchingContainer2"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer2" value="option2"><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect2" value="option2"><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(2,11)" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
    $codform .= '</div>';
    $codform .= "<div style='display: none' id='addNewMatchingAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(11); return false' counter='2' name='addNewAnswer' id='addNewMatchingAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
    return $codform;
}

function insertDefaultPuzzle() {
    $codform = "<div style='display: none' id='puzzleImageContainer'><button class='button button-primary' id='selectImage' style='margin-bottom: 0.5vw' type='button'>".__("Select image","knq")."</button><br><div id='puzzleGridContainer'><label for='puzzleRows'>".__("Number of rows","knq").": </label><input style='margin-bottom: 0.5vw' min='2' id='puzzleRows' name='puzzleRows' type='number' value='3'><label for='puzzleColumns'>".__("Number of columns","knq").": </label><input style='margin-bottom: 0.5vw' min='2' id='puzzleColumns' name='puzzleColumns' type='number' value='4'></div>";
    $codform .= '<div class="puzzleImageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" class="puzzleImageUrl" id="puzzleImageUrl" name="puzzleImageUrl" value=""><img id="puzzleImage" src="" style="max-height: 100px; width: auto;"></div></div>';
    return $codform;
}

function insertDefaultMatchImages() {
    $codform = "<div style='display:none;' id='matchImagesContainer'><div id='matchImages'><button class='button button-primary' id='selectMatchImages' type='button'>Select Images</button><br><div id='matchImageWidthContainer'><label for='matchImageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='matchImageWidth' name='matchImageWidth' type='number' value='10'><label for='matchImageWidth'>%</label></div></div><div style='clear:both'></div>";
    $codform .= "<div id='matchExtraWordsContainer'><label for='matchExtraWords'>" . __('Extra words that do not correspond to any image (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='matchExtraWords' name='matchExtraWords'></textarea></div>";
    $codform .= "</div>";
    return $codform;
}

function insertDefaultCategories() {
    $codform = "<ul style='display: none' id='categories'>";
    $codform .= "<li id='category1' class='category'><label for='categoryName1'>Category Name:</label><br><input type='text' id='categoryName1' name='categoryName1' value='Category 1'><br><label for='category1Elements'>Elements belonging to the category:</label><br><input size='80' type='text' id='category1Elements' name='category1Elements' value='element 1, element 2'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(1, 15)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button></li>";
    $codform .= "<li id='category2' class='category'><label for='categoryName2'>Category Name:</label><br><input type='text' id='categoryName2' name='categoryName2' value='Category 2'><br><label for='category2Elements'>Elements belonging to the category:</label><br><input size='80' type='text' id='category2Elements' name='category2Elements' value='element 1, element 2'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(2, 15)' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button></li>";
    $codform .= "</ul>";
    $codform .= "<div style='display: none' id='addNewCategoryContainer'>" . __("To add a new category, click here", "knq") . ": <button onclick='newAnswer(15); return false' counter='3' name='addNewCategory' id='addNewCategory' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button></div>";
    return $codform;
}

function insertDefaultPixelatedImage() {
    $codform = "<div style='display: none' id='pixelatedImageContainer'><button class='button button-primary' id='selectPixelatedImage' style='margin-bottom: 0.5vw' type='button'>".__("Select image","knq")."</button><br><label for='imageAnswer'>".__("What is in the image?","knq").": </label><input style='margin-bottom: 0.5vw' id='imageAnswer' name='imageAnswer' type='text' value=''>";
    $codform .= '<div class="pixelatedImageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" class="pixelatedImageUrl" id="pixelatedImageUrl" name="pixelatedImageUrl" value=""><img id="pixelatedImage" src="" style="max-height: 100px; width: auto;"></div></div>';
    return $codform;
}

function knq_questions()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-circle-question" aria-hidden="true"></i> ' . __('Questions management', 'knq') . '</h2><br>';

    // definire formular alegere quiz
    $codform = "";
    $codform .= '<script type="text/javascript">correctText="' . __('Correct', 'knq') . '"; trueText="' . __('True', 'knq') . '"; msg_delq="' . __("Are you sure? There is no undo to that!", "knq") . '";</script>';
    $codform .= '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="option_page" value="general" /><input type="hidden" name="valid" value="1" />';
    $codform .= "<select onchange='this.form.submit()' data-placeholder='" . __('Choose a quiz', 'knq') . "' class='chosen-select' size=1 name='quizId' id='quizId'>";
    $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
    $idu = $quizzes[0]->maxqid;
    $qid = 0;
    $check = true;
    if (isset($_POST["valid4"])) {
        $idu = $_POST["quizId4"] - 0;
        $qid = $_POST["questionId4"] - 0;
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq WHERE quiz_id=%d AND order_id=%d", $idu, $qid)
        );
        if (!$result || !(gettype($result) == 'integer')) {
            $check = false;
        }
        $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $idu . "  ORDER BY order_id"));
        if (sizeof($intrebari) != 0) {
            $qid = $intrebari[0]->order_id;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("Question deleted succesfully", "knq") . '!</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __("Error on deleting the question", "knq") . '!</strong></p></div>';
        }

    }
    if (isset($_POST["valid3"])) {
        $idu = $_POST["quizId3"] - 0;
        $qid = $_POST["questionId3"] - 0;
    }
    if (isset($_POST["valid2"])) {
        $idu = $_POST["quizId2"] - 0;
        $qid = $_POST["questionId2"] - 0;
    }
    if (isset($_POST["valid"])) {
        //am submis formularul
        $idu = $_POST["quizId"] - 0;
    }
    $quizuri = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT quiz_id, option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id!=0 AND option_name='title' ORDER BY option_value"));
    $crttitle = "";
    foreach ($quizuri as $quiz) {
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quiz->quiz_id . " AND option_name='title'"));
        $codform .= '<option value="' . $quiz->quiz_id . '"' . ($quiz->quiz_id == $idu ? 'selected' : '') . '>' . (count($title) == 0 ? $quiz->quiz_id : $title[0]->option_value) . " [id:" . $quiz->quiz_id . "]</option>";
        if ($quiz->quiz_id == $idu)
            $crttitle = (count($title) == 0 ? $quiz->quiz_id : $title[0]->option_value);
    }
    $codform .= '</select>';
    $codform .= '</form>';

    // daca am ales un quiz
    //am submis formularul
    $quizId = $idu;

    $check = true;
    if (isset($_POST["valid3"])) {
        $answerCounter = $_POST["answerCounter"];
        $answerBuilder = "";
        $correctAnswerBuilder = "";
        if ($_POST["typeSelect"] == '1' || $_POST["typeSelect"] == '2' || $_POST["typeSelect"] == '3' || $_POST["typeSelect"] == '12' || $_POST["typeSelect"] == '9') {
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["answer" . $i]) && $_POST["answer" . $i] != "") {
                    $answerBuilder .= $_POST["answer" . $i] . "|";
                    if (isset($_POST["correct" . $i]) && $_POST["correct" . $i] == "correct") {
                        $correctAnswerBuilder .= $i . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
            if ($_POST["typeSelect"] == '9') {
                $correctAnswerBuilder .= $_POST['crosswordAnswers'] . '|' . $_POST['crosswordRightColumn'];
            }
        } else if ($_POST["typeSelect"] == '4') {
            $answerBuilder .= $_POST["singleAnswer"];
        } else if ($_POST["typeSelect"] == '5') {
            $answerBuilder .= $_POST["singleAnswer"] . '|' . $_POST["extraWords"];
        } else if ($_POST["typeSelect"] == '6' || $_POST["typeSelect"] == '7') {
            $answerBuilder .= $_POST['imageWidth'] . "|";
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["imageUrl" . $i]) && $_POST["imageUrl" . $i] != "") {
                    $answerBuilder .= $_POST["imageUrl" . $i] . "|";
                    if (isset($_POST["correctImage" . $i]) && $_POST["correctImage" . $i] == "correct") {
                        $correctAnswerBuilder .= $i . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
        } else if ($_POST["typeSelect"] == '8') {
            $wordsSearch = $_POST["wordsSearch"];
            //împotriva spațiilor în plus fac câteva replace-uri
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace("  ", " ", $wordsSearch);
            $wordsSearch = str_replace(" ", "#", $wordsSearch);
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["spaceSearch" . $i]) && $_POST["spaceSearch" . $i] != '') {
                    $spS = $_POST["spaceSearch" . $i];
                    $nr = "";
                    if (is_numeric(substr($spS, -2))) {
                        $nr .= substr($spS, -2);
                        $spS = substr($spS, 0, -3);
                    } else if (is_numeric(substr($spS, -1))) {
                        $nr .= substr($spS, -1);
                        $spS = substr($spS, 0, -2);
                    }
                    if ($nr != "")
                        $nr = sprintf("%02d", $nr);
                    $answerBuilder .= $nr . $spS . "[]";
                }
            }
            $answerBuilder = rtrim($answerBuilder, "[]");
            $answerBuilder = trim(preg_replace('/\s+/', '#', $answerBuilder));
            $answerBuilder .= "|" . $wordsSearch . "|" . $_POST["restLit"];
        } else if ($_POST["typeSelect"] == '11') {
            $answerBuilder .= $_POST['answerColumnWidth'] . '[[';
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["matchingAnswer" . $i]) && $_POST["matchingAnswer" . $i] != "") {
                    $answerBuilder .= $_POST["matchingAnswer" . $i] . "|";
                    if (isset($_POST["matchingCorrect" . $i]) && $_POST["matchingCorrect" . $i] != "") {
                        $correctAnswerBuilder .= $_POST["matchingCorrect" . $i] . "|";
                    }
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $correctAnswerBuilder = rtrim($correctAnswerBuilder, "|");
        } else if ($_POST["typeSelect"] == '13') {
            $answerBuilder .= $_POST['puzzleRows'] . '|' . $_POST['puzzleColumns'] . '|' . $_POST['puzzleImageUrl'];
        } else if ($_POST["typeSelect"] == '14') {
            $answerBuilder .= $_POST['matchImageWidth'] . "|";
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["matchImageUrl" . $i]) && $_POST["matchImageUrl" . $i] != "") {
                    $answerBuilder .= $_POST["matchImageUrl" . $i] . "|";
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $answerBuilder .= "[[";
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["imageTitle" . $i]) && $_POST["imageTitle" . $i] != "") {
                    $answerBuilder .= $_POST["imageTitle" . $i] . "|";
                }
            }
            $answerBuilder = rtrim($answerBuilder, "|");
            $answerBuilder .= "[[";
            $answerBuilder .= $_POST["matchExtraWords"];
        } else if ($_POST["typeSelect"] == '15') {
            for ($i = 1; $i < $answerCounter; $i++) {
                if (isset($_POST["categoryName" . $i]) && $_POST["categoryName" . $i] != "" && isset($_POST["category" . $i . "Elements"]) && $_POST["category" . $i . "Elements"] != "") {
                    $answerBuilder .= $_POST["categoryName" . $i] . "|" . str_replace(", ", "|", $_POST["category" . $i . "Elements"]);
                    $answerBuilder .= "[[";
                }
            }
            $answerBuilder = rtrim($answerBuilder, "[[");
        } else if ($_POST["typeSelect"] == '16') {
            $answerBuilder .= $_POST['pixelatedImageUrl'];
            $correctAnswerBuilder .= $_POST['imageAnswer'];
        }
        $noShuffle = "";
        if (isset($_POST["noShuffle"]) && $_POST["noShuffle"] == "on") {
            $noShuffle .= "***";
        }
        $sql = "UPDATE " . $wpdb->prefix . "knq SET question='" . addslashes(stripslashes($_POST["questionArea"])) . $noShuffle . "', type=" . $_POST["typeSelect"] . ", answers='" . addslashes(stripslashes($answerBuilder)) . "', right_one='" . $correctAnswerBuilder . "', feedbackp='" . addslashes(stripslashes($_POST["positiveArea"])) . "', feedbackn='" . addslashes(stripslashes($_POST["negativeArea"])) . "', image='" . $_POST["imageUrl"] . "', image_position='" . $_POST["image_position"] . "' WHERE quiz_id=" . $quizId . " AND order_id=" . $qid;
        // aici actualizez în baza de date întrebarea
        $result = $wpdb->query($wpdb->prepare($sql));
        if ($result == false && $result != 0) {
            $check = false;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __('Question updated', 'knq') . '</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __('Error updating question', 'knq') . '</strong></p></div>';
        }
    }
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    $date = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE option_name = 'created' AND quiz_id = " . $quizId));
    $codform .= "<center><h2>" . __("Selected quiz", "knq") . ": " . $crttitle . "</h2>(" . $user[0]->display_name . ', ' . date_i18n(get_option('date_format'), strtotime($date[0]->option_value)) . ', ' . date_i18n(get_option('time_format'), strtotime($date[0]->option_value)) . ")</center><br>";
    $codform .= "<br>";

    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT count(order_id) as howm FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    if ($intrebari[0]->howm - 0 == 0) {
        $wpdb->query($wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq (quiz_id,order_id,question,type,answers,right_one,feedbackp,feedbackn,image,image_position) VALUES ($quizId,1,'" . __('Demo question (please configure).', 'knq') . "',1,'" . __('option 1|option 2', 'knq') . "','1','','','','')"));
    }

    // the list of quiz form was submited
    if (isset($_POST["valid2"])) {
        if ($_POST["intrebare"] == 0) {
            // was chosen the option to add a new question
            $intrebari = $wpdb->get_results($wpdb->prepare("SELECT max(order_id) as max FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
            $wpdb->query($wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq (quiz_id,order_id,question,type,answers,right_one,feedbackp,feedbackn,image,image_position) VALUES ($quizId," . ($intrebari[0]->max - 0 + 1) . ",'" . __('Demo question (please configure).', 'knq') . "',1,'" . __('option 1|option 2', 'knq') . "','1','','','','')"));
            $qid = $intrebari[0]->max - 0 + 1;
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("A new question was added. Do not forget to configure the question!", "knq") . '</strong></p></div>';
        } else $qid = $_POST["intrebare"];
    }
    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT question, order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    // definire formular alegere intrebare
    $codformS = '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="questions_page" value="general" /><input type="hidden" name="valid2" value="1" /><input type="hidden" name="quizId2" value="' . $quizId . '" /><input type="hidden" name="questionId2" value="' . $qid . '" />';
    $codformS .= "<select onchange='this.form.submit()' size=1 name='intrebare' id='intrebare'><option value=0>" . __("ADD NEW QUESTION", "knq") . "</option>";
    if ($qid == 0) {
        $qid = $intrebari[0]->order_id;
    }
    $mockId = 1;
    foreach ($intrebari as $intrebare) {
        $codformS .= '<option class="question_option" value="' . $intrebare->order_id . '"' . ($intrebare->order_id == $qid ? 'selected' : '') . '>' . __("Question", "knq") . ' ' . $mockId . ': ' . rtrim($intrebare->question, "***") . "</option>";
        $mockId++;
    }
    $codformS .= '</select>';
    $codformS .= '</form>';
    $detaliiIntrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT question, type, answers, right_one, feedbackp, feedbackn, image, image_position FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . " AND order_id=" . $qid));
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= '<tr style="background-color:#A6C4DD;"><td align=center>' . $codformS . '</td></tr></table>';
    $codform .= '<form method="post" action="" onsubmit="return checkQuestionFormData();" novalidate="novalidate"><input type="hidden" name="valid3" value="1" /><input type="hidden" name="quizId3" value="' . $quizId . '" /><input type="hidden" name="questionId3" value="' . $qid . '"><table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $counter = 1;
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='questionArea'>" . __("Question", "knq") . ":</label></td><td><textarea rows='5' cols='100' name='questionArea' id='questionArea'>" . rtrim($detaliiIntrebari[0]->question, "***") . "</textarea></td><td><label for='noShuffle'>" . __('Do not shuffle this question\'s answers', 'knq') . ": </label><input " . (strpos($detaliiIntrebari[0]->question, "***")?"checked":"") . " id='noShuffle' name='noShuffle' type='checkbox'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='typeSelect'>" . __("Question type", "knq") . ":</label></td><td colspan='2'><select name='typeSelect' id='typeSelect'><option value='1'" . ($detaliiIntrebari[0]->type == 1 ? "selected" : "") . ">" . __("Multiple choice (check box)", "knq") . "</option><option style='margin-left: 1vw' value='2'" . ($detaliiIntrebari[0]->type == 2 ? "selected" : "") . ">" . __("Single choice (radio box)", "knq") . "</option><option value='6'" . ($detaliiIntrebari[0]->type == 6 ? "selected" : "") . ">" . __("Multiple choice with images (check box)", "knq") . "</option><option value='7'" . ($detaliiIntrebari[0]->type == 7 ? "selected" : "") . ">" . __("Single choice with images (radio box)", "knq") . "</option><option value='3'" . ($detaliiIntrebari[0]->type == 3 ? "selected" : "") . ">" . __("Sort the answers (sorting)", "knq") . "</option><option value='4'" . ($detaliiIntrebari[0]->type == 4 ? "selected" : "") . ">" . __("Choose the words from lists (select box)", "knq") . "</option><option value='5'" . ($detaliiIntrebari[0]->type == 5 ? "selected" : "") . ">" . __("Word bank (drag & drop)", "knq") . "</option><option value='8'" . ($detaliiIntrebari[0]->type == 8 ? "selected" : "") . ">" . __("Word search", "knq") . "</option><option value='9'" . ($detaliiIntrebari[0]->type == 9 ? "selected" : "") . ">" . __("Crosswords", "knq") . "</option><option value='11'" . ($detaliiIntrebari[0]->type == 11 ? "selected" : "") . ">" . __("Text matching", "knq") . "</option><option value='12'" . ($detaliiIntrebari[0]->type == 12 ? "selected" : "") . ">" . __("True or False", "knq") . "</option><option value='13'" . ($detaliiIntrebari[0]->type == 13 ? "selected" : "") . ">" . __("Puzzle", "knq") . "</option><option value='14'" . ($detaliiIntrebari[0]->type == 14 ? "selected" : "") . ">" . __("Match image", "knq") . "</option><option value='15'" . ($detaliiIntrebari[0]->type == 15 ? "selected" : "") . ">" . __("Sort words in categories", "knq") . "</option><option value='16'" . ($detaliiIntrebari[0]->type == 16 ? "selected" : "") . ">" . __("Guess pixelated image", "knq") . "</option></select></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label>" . __("Answer(s)", "knq") . ":</label></td><td colspan='2'>";
    if ($detaliiIntrebari[0]->type == 1 || $detaliiIntrebari[0]->type == 2 || $detaliiIntrebari[0]->type == 3 || $detaliiIntrebari[0]->type == 12 || $detaliiIntrebari[0]->type == 9) {
        $codform .= "<ul id='answers'>";
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        foreach ($answersArray as $answer) {
            $codform .= '<li id="answerLi' . $counter . '" class="answerLi" style="padding: 0.5vw; width:fit-content;"><div class="answerContainer" style="display: inline-block" name="answerContainer' . $counter . '" id="answerContainer' . $counter . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="80" class="answer" name="answer' . $counter . '" value="' . $answer . '">';
            $codform .= "<button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer($counter," . $detaliiIntrebari[0]->type . ")' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button>";
            if ($detaliiIntrebari[0]->type == 3 || $detaliiIntrebari[0]->type == 9) {
                $codform .= "<input type='checkbox' onclick='uncheckAnswers(" . $counter . ")' class='correct' style='display: none' id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                $codform .= "<label class='correct_label' style='display: none' for='correct" . $counter . "'>" . __("Correct", "knq") . "</label></div></li>";
            } else {
                if (strpos($detaliiIntrebari[0]->right_one, "" . $counter) !== false) {
                    $codform .= "<input type='" . ($detaliiIntrebari[0]->type!=2?'checkbox':'radio') . "' onclick='uncheckAnswers(" . $counter . ")' class='correct' checked id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                } else {
                    $codform .= "<input type='" . ($detaliiIntrebari[0]->type!=2?'checkbox':'radio') . "' onclick='uncheckAnswers(" . $counter . ")' class='correct' id='correct" . $counter . "' name='correct" . $counter . "' value='correct'>";
                }
                $codform .= "<label class='correct_label' for='correct" . $counter . "'>" . ($detaliiIntrebari[0]->type==12?__("True", "knq"):__("Correct", "knq")) . "</label></div></li>";
            }
            $counter++;
        }
        $codform .= "</ul><div id='addNewAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(" . $detaliiIntrebari[0]->type . "); return false' counter='$counter' name='addNewAnswer' id='addNewAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";

        //TODO: use lambda here
        if ($detaliiIntrebari[0]->type == 9) {
            $crossword = explode('|', $detaliiIntrebari[0]->right_one);
            $codform .= "<div id='crosswordContainer' style='padding: 0.5vw; width:fit-content;'><label for='crosswordAnswers'>" . __('Write the crossword solution here', 'knq') . ":</label><br><textarea rows='5' cols='100' id='crosswordAnswers' name='crosswordAnswers'>" . $crossword[0] . "</textarea><br><label for='crosswordRightColumn'>" . __('On which column is the result of the crossword', 'knq') . "?</label><input type='number' min='1' id='crosswordRightColumn' name='crosswordRightColumn' value='" . $crossword[1] . "'></div>";
        } else {
            $codform .= "<div id='crosswordContainer' style='padding: 0.5vw; width:fit-content; display: none'><label for='crosswordAnswers'>" . __('Write the crossword solution here', 'knq') . ":</label><br><textarea rows='5' cols='100' id='crosswordAnswers' name='crosswordAnswers'></textarea><br><label for='crosswordRightColumn'>" . __('On which column is the result of the crossword', 'knq') . "?</label><input type='number' min='1' id='crosswordRightColumn' name='crosswordRightColumn' value=''></div>";
        }
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 4 || $detaliiIntrebari[0]->type == 5) {
        $codform .= insertDefaultAnswerList();
        if ($detaliiIntrebari[0]->type == 4) {
            $codform .= "<div id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer'>" . $detaliiIntrebari[0]->answers . "</textarea>";
            $codform .= "<p id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar (pipe), the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</p>";
            $codform .= "<p style='display: none' id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p>";
            $codform .= "<div style='display: none' id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div>";
        } else {
            $answers = explode('|', $detaliiIntrebari[0]->answers);
            $codform .= "<div id='singleAnswerContainer'><textarea rows='5' cols='100' autocomplete='off' size=\'80\' id='singleAnswer' name='singleAnswer'>" . $answers[0] . "</textarea>";
            $codform .= "<p style='display: none' id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar (pipe), the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</p>";
            $codform .= "<p id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p>";
            if (count($answers) > 1) {
                $codform .= "<div id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'>" . $answers[1] . "</textarea></div>";
            } else {
                $codform .= "<div id='extraWordsContainer'><label for='extraWords'>" . __('Extra words that are not found in the text above (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='extraWords' name='extraWords'></textarea></div>";
            }

        }
        //$codform .= "<p " . ($detaliiIntrebari[0]->type == 5 ? "style='display: none'" : "") . " id='instructions4th'>" . __("Include between double square brackets, separated by a vertical bar, the alternative words.<br>Put the correct one to be the first in list. The list of options will be shuffled.<br>Example: <strong>We live on [[Earth|Jupiter|Saturn|Moon]].</strong>", "knq") . "</p>";
        //$codform .= "<p " . ($detaliiIntrebari[0]->type == 4 ? "style='display: none'" : "") . " id='instructions5th'>" . __("The word bank will collect all the words between double square brackets.<br>Example: <strong>This is an [[example]] of such a [[question]].</strong>", "knq") . "</p>";
        $codform .= "</div>";
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 6 || $detaliiIntrebari[0]->type == 7) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        $codform .= "<div id='imagesContainer'><button class='button button-primary' id='selectImages' style='margin-bottom: 0.5vw' type='button'>".__("Select images","knq")."</button><br><div id='imageWidthContainer'><label for='imageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='imageWidth' name='imageWidth' type='number' value='" . $answersArray[0] . "'><label for='imageWidth'>%</label></div>";
        for ($i = 1; $i < count($answersArray); $i++) {
            $answer = $answersArray[$i];
            $imageInfo = explode('[]', $answer);
            $codform .= '<div class="imageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" data-id="' . $imageInfo[1] . '" class="imageUrl" id="imageUrl' . $counter . '" name="imageUrl' . $counter . '" value="' . $answer . '"><img src="' . $imageInfo[0] . '" style="max-height: 100px; width: auto;"><br><input type="' . ($detaliiIntrebari[0]->type==6?"checkbox":"radio") . '" onclick="uncheckImages(' . $counter . ')" class="correctImage" id="correctImage' . $counter . '" name="correctImage' . $counter . '" ' . (strpos($detaliiIntrebari[0]->right_one, "" . $counter) !== false ? 'checked' : '') . ' value="correct"><label for="correctImage' . $counter . '">Correct</label></div>';
            $counter++;
        }
        $codform .= "</div>";
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 8) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        $careuri = explode("[]", $answersArray[0]);
        $counter = sizeOf($careuri) - 0 + 1;
        $codform .= "<div id='wordSearch'><div style='display: flex'>";
        for ($i = 1; $i < sizeOf($careuri) - 0 + 1; $i++) {
            $carcrt = $careuri[$i - 1];
            $diag = 0;
            if (is_numeric(substr($carcrt, 0, 1))) {
                //dacă începe cu un digit are de fapt 2 digiți la începuți indicând numărul de diagonale
                $diag = substr($carcrt, 0, 2) - 0;
                $carcrt = substr($carcrt, 2);
            }

            $careul = str_replace("#", "\n", $carcrt) . ($diag ? "\n" . $diag : "");
            $codform .= '<div class="spaceSearchContainer" id="spaceSearchContainer' . $i . '"><textarea style="font-family: Courier New;" rows="12" cols="12" autocomplete="off" id="spaceSearch' . $i . '" name="spaceSearch' . $i . '" class="spaceSearch">' . $careul . '</textarea><br><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: auto; margin-right: auto; display: block" onclick="deleteAnswer(' . $i . ',' . $detaliiIntrebari[0]->type . ')" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
        }
        $codform .= "</div><br><div id='addNewWordSearchAnswerContainer'>" . __("To add a new word search area, click here", "knq") . ": <button onclick='newAnswer(" . $detaliiIntrebari[0]->type . "); return false' counter='$counter' name='addNewWordSearchAnswer' id='addNewWordSearchAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
        $codform .= '<p>' . __('Words to be searched, separated by one space', 'knq') . '.<br><input autocomplete="off" type="text" id="wordsSearch" name="wordsSearch" size="80" value="' . str_replace("#", " ", $answersArray[1]) . '"></p>';
        $codform .= '<p>' . __('If unused letters forms a message, please write it below.', 'knq') . '<br><input type="text" id="restLit" name="restLit" size="80" value="' . $answersArray[2] . '"></p>';
        $codform .= "</div>";
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 11) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= '<div id="matching">';
        $firstColumnWidth = explode('[[', $detaliiIntrebari[0]->answers);
        $codform .= '<div style="width: 50%" id="answerColumnWidthContainer"><label for="answerColumnWidth">' . __('First column width:', 'knq') . ': </label><input id="answerColumnWidth" name="answerColumnWidth" min="1" max="100" type="number" value="' . $firstColumnWidth[0] . '"><label for="answerColumnWidth">%</label></div>';
        $answersArray = explode("|", $firstColumnWidth[1]);
        $rightOnesArray = explode("|", $detaliiIntrebari[0]->right_one);
        for ($i = 1; $i <= count($answersArray); $i++) {
            $codform .= '<div style="height: 5vh; display: flex; align-items: center;" class="answerContainer" name="matchingContainer' . $i . '" id="matchingContainer' . $i . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input autocomplete="off" size="50" class="matchingAnswer" name="matchingAnswer' . $i . '" value="' . $answersArray[$i - 1] . '"><input autocomplete="off" size="50" class="matchingCorrect" name="matchingCorrect' . $i . '" value="' . $rightOnesArray[$i - 1] . '"><button type=button class="button button-secondary" style="background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;" onclick="deleteAnswer(' . $i . ', ' . $detaliiIntrebari[0]->type . ')" class="button button-primary"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>';
            $counter++;
        }
        $codform .= '</div>';
        $codform .= "<div id='addNewMatchingAnswerContainer'>" . __("To add a new answer, click here", "knq") . ": <button onclick='newAnswer(11); return false' counter='2' name='addNewAnswer' id='addNewMatchingAnswer' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button><br></div>";
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 13) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $answersArray = explode("|", $detaliiIntrebari[0]->answers);
        $codform .= "<div id='puzzleImageContainer'><button class='button button-primary' id='selectImage' style='margin-bottom: 0.5vw' type='button'>".__("Select image","knq")."</button><br><div id='puzzleGridContainer'><label for='puzzleRows'>".__("Number of rows","knq").": </label><input style='margin-bottom: 0.5vw' min='2' id='puzzleRows' name='puzzleRows' type='number' value='" . $answersArray[0] . "'><label for='puzzleColumns'>".__("Number of columns","knq").": </label><input style='margin-bottom: 0.5vw' min='2' id='puzzleColumns' name='puzzleColumns' type='number' value='" . $answersArray[1] . "'></div>";
        $codform .= '<div class="puzzleImageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" class="puzzleImageUrl" id="puzzleImageUrl" name="puzzleImageUrl" value="' . $answersArray[2] . '"><img id="puzzleImage" src="' . $answersArray[2] . '" style="max-height: 100px; width: auto;"></div></div>';
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 14) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $answersArray = explode("[[", $detaliiIntrebari[0]->answers);
        $imagesArray = explode('|', $answersArray[0]);
        $wordsArray = explode('|', $answersArray[1]);
        $codform .= "<div id='matchImagesContainer'><div id='matchImages'><button class='button button-primary' id='selectMatchImages' style='margin-bottom: 0.5vw' type='button'>".__("Select images","knq")."</button><br><div id='matchImageWidthContainer'><label for='matchImageWidth'>".__("Image width","knq").": </label><input style='margin-bottom: 0.5vw' min='1' max='100' id='matchImageWidth' name='matchImageWidth' type='number' value='" . $imagesArray[0] . "'><label for='matchImageWidth'>%</label></div>";
        for ($i = 1; $i < count($imagesArray); $i++) {
            $answer = $imagesArray[$i];
            $imageInfo = explode('[]', $answer);
            $codform .= '<div class="matchImageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" data-id="' . $imageInfo[1] . '" class="matchImageUrl" id="matchImageUrl' . $counter . '" name="matchImageUrl' . $counter . '" value="' . $answer . '"><img src="' . $imageInfo[0] . '" style="max-height: 100px; width: auto;"><br><input type="text" class="imageTitle" id="imageTitle' . $counter . '" name="imageTitle' . $counter . '" value="' . $wordsArray[$i - 1] . '"></div>';
            $counter++;
        }
        // TODO when changin between match image and puzzle images are already selected - could not recreate
        // TODO export quiz - JSON with all questions
        // TODO aritmogrife
        $codform .= "</div><div style='clear:both'></div><div id='matchExtraWordsContainer'><label for='matchExtraWords'>" . __('Extra words that do not correspond to any image (leave empty if you do not wish to have such words)', 'knq') . ":</label><textarea rows='5' cols='100' id='matchExtraWords' name='matchExtraWords'>" . $answersArray[2] . "</textarea></div>";
        $codform .= "</div>";
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 15) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= "<ul id='categories'>";
        $answersArray = explode("[[", $detaliiIntrebari[0]->answers);
        for ($i = 0; $i < count($answersArray); $i++) {
            $categoryArray = explode('|', $answersArray[$i]);
            $counter++;
            $codform .= "<li id='category" . ($i + 1) . "' class='category'><label for='categoryName" . ($i + 1) . "'>Category Name:</label><br><input type='text' id='categoryName" . ($i + 1) . "' name='categoryName" . ($i + 1) . "' value='" . $categoryArray[0] . "'><br><label for='category" . ($i + 1) . "Elements'>Elements belonging to the category:</label><br><input size='80' type='text' id='category" . ($i + 1) . "Elements' name='category" . ($i + 1) . "Elements' value='" . implode(", ", array_slice($categoryArray, 1)) . "'><button type=button class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white; margin-left: 0.5vw; margin-right: 0.5vw;' onclick='deleteAnswer(" . $counter - 1 . ", " . $detaliiIntrebari[0]->type . ")' class='button button-primary'><i class='fa fa-minus-circle' aria-hidden='true'></i></button></li>";
        }
        $codform .= "</ul><div id='addNewCategoryContainer'>" . __("To add a new category, click here", "knq") . ": <button onclick='newAnswer(" . $detaliiIntrebari[0]->type . "); return false' counter='$counter' name='addNewCategory' id='addNewCategory' class='button button-primary'><i class='fa fa-plus-circle' aria-hidden=\"true\"></i></button></div>";
        $codform .= insertDefaultPixelatedImage();
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 16) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= "<div id='pixelatedImageContainer'><button class='button button-primary' id='selectPixelatedImage' style='margin-bottom: 0.5vw' type='button'>".__("Select image","knq")."</button><br><label for='imageAnswer'>".__("What is in the image?","knq")."</label><input style='margin-bottom: 0.5vw' id='imageAnswer' name='imageAnswer' type='text' value='" . $detaliiIntrebari[0]->right_one . "'><br>";
        $codform .= '<div class="pixelatedImageUrlContainer" style="margin: 0.5vw; float: left; text-align: center"><input style="display: none" class="pixelatedImageUrl" id="pixelatedImageUrl" name="pixelatedImageUrl" value="' . $detaliiIntrebari[0]->answers . '"><img id="pixelatedImage" src="' . $detaliiIntrebari[0]->answers . '" style="max-height: 100px; width: auto;"></div></div>';
        $codform .= "</td></tr>";
    } else if ($detaliiIntrebari[0]->type == 9) {
        $codform .= insertDefaultAnswerList();
        $codform .= insertDefaultSingleAnswer();
        $codform .= insertDefaultImageAnswers();
        $codform .= insertDefaultWordSearch();
        $codform .= insertDefaultMatching();
        $codform .= insertDefaultPuzzle();
        $codform .= insertDefaultMatchImages();
        $codform .= insertDefaultCategories();
        $codform .= insertDefaultPixelatedImage();

    }
    $codform .= "<input id='answerCounter' name='answerCounter' style='display: none' value='" . $counter . "'>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='positiveArea'>" . __("Positive feedback", "knq") . ":</label></td><td colspan='2'><textarea rows='5' cols='100' name='positiveArea' id='positiveArea'>" . $detaliiIntrebari[0]->feedbackp . "</textarea></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%><label for='negativeArea'>" . __("Negative feedback", "knq") . ":</label></td><td colspan='2'><textarea rows='5' cols='100' name='negativeArea' id='negativeArea'>" . $detaliiIntrebari[0]->feedbackn . "</textarea></td></tr>";
    if (isset($_POST['submit_image_selector']) && isset($_POST['image_attachment_id'])) :
        update_option('media_selector_attachment_id', absint($_POST['image_attachment_id']));
    endif;
    wp_enqueue_media();
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td widht=30%>" . __("Associated image", "knq") . ":</td><td colspan='2'><div class='image-preview-wrapper'><input type='hidden' name='imageUrl' id='imageUrl' value='" . ($detaliiIntrebari[0]->image != NULL ? $detaliiIntrebari[0]->image : "") . "'><img id='image-preview' src='" . ($detaliiIntrebari[0]->image != NULL ? $detaliiIntrebari[0]->image : "' style='display:none") . "' width='100' height='100' style='max-height: 100px; width: auto;'>
                </div>
                <input id='upload_image_button' type='button' class='button button-primary' value='" . __("Load image", "knq") . "' /> <button type='button' id='remove_image' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' style='margin-left: 1vw'  onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'>" . __("Delete image", "knq") . "</button><input type='hidden' name='image_attachment_id' id='image_attachment_id' value=''><br><br>";
    $codform .= "<label for='image_position'>" . __("Image position related to question text", "knq") . ":</label> <select name='image_position' id='image_position'><option value='above'" . ($detaliiIntrebari[0]->image_position == "above" ? "selected" : "") . ">" . __("Above", "knq") . "</option><option value='below'" . ($detaliiIntrebari[0]->image_position == "below" ? "selected" : "") . ">" . __("Below", "knq") . "</option><option value='left'" . ($detaliiIntrebari[0]->image_position == "left" ? "selected" : "") . ">" . __("Left", "knq") . "</option><option value='right'" . ($detaliiIntrebari[0]->image_position == "right" ? "selected" : "") . ">" . __("Right", "knq") . "</option></select></td></tr>";
    $codform .= '<tr style="background-color:#A6C4DD">' . "<td widht=30%></td><td colspan='2'><input type='submit'  class='button button-primary' id='updateQuestion' value='" . __("Update question", "knq") . "'></td></tr>";
    $codform .= '</table>';
    $codform .= "</form><br>";
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - just the quiz", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title and the description", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1 description=1]'></td></tr>";
    $codform .= "</table><br>";
    wp_enqueue_media();
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= "<tr class=inactive><td width=20% style='vertical-align:middle;'>" . __("Be careful! When you delete a question, there is no undo!", "knq") . "</td><td style='vertical-align:middle;'><form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuiz' value='" . __("Delete question", "knq") . "' onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'><input type='hidden' name='valid4' value='1'><input type='hidden' name='quizId4' value='" . $quizId . "' /><input type='hidden' name='questionId4' value='" . $qid . "'></form></td></tr></table>";
    $codform .= '<script type="text/javascript">empty_input="' . __('Empty input', 'knq') .'"; invalid_columns="' . __('Invalid columns', 'knq') .'"; invalid_rows="' . __('Invalid rows', 'knq') . '"; no_image_selected="' . __('No image selected', 'knq') . '"; empty_question="' . __('Empty question', 'knq') .'"; min_2_answers="' . __('At least 2 answers needed', 'knq') . '"; min_2_images="' . __('At least 2 images needed', 'knq') . '"; empty_answer="' . __('Empty answer', 'knq') . '"; no_right_answer="' . __('No right answer selected', 'knq') . '"; too_many_right_answers="' . __('Too many right answers selected', 'knq') .  '"; incorrect_formating = "' . __('Incorrect formatting', 'knq') .'"; width_limit="' . __('Must be between 1 and 100', 'knq') .'"; empty_word_search="' . __('Empty word search', 'knq') . '"; no_search_words="' . __('No search words provided', 'knq') . '"; min_3_search_words="' . __('Provide at least 3 search words', 'knq') . '"</script>';
    //"<form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuestion' value='" . __("Delete question", "knq") . "'><input type='hidden' name='valid4' value='1'><input type='hidden' name='quizId4' value='" . $quizId . "' /><input type='hidden' name='questionId4' value='" . $qid . "'></form>";
    echo $codform;
    echo '</div>';
}
