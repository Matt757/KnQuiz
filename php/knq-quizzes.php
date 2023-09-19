<?php

function knq_quizzes()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-list-check" aria-hidden="true"></i> ' . __('Quizzes management', 'knq') . '</h2><br>';

    // definire formular alegere quiz
    $codform = '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="option_page" value="general" /><input type="hidden" name="valid" value="1" />';
    $codform .= "<select onchange='this.form.submit()' class='chosen-select' size=1 name='quizId' id='quizId'>";
    $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
    $idu = $quizzes[0]->maxqid;
    $check = true;
    if (isset($_POST["valid2"])) {
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=%d", $idu)
        );
        if (!$result || !(gettype($result) == 'integer')) {
            $check = false;
        }
        $result = $wpdb->query(
            $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq WHERE quiz_id=%d", $idu)
        );
        if (!$result && $result != 0) {
            $check = false;
        }
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __("Quiz deleted succesfully", "knq") . '!</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __("Error on deleting the quiz", "knq") . '!</strong></p></div>';
        }
        $quizzes = $wpdb->get_results($wpdb->prepare("SELECT MAX(quiz_id) AS maxqid FROM " . $wpdb->prefix . "knq_details ORDER BY quiz_id"));
        if (sizeof($quizzes) != 0) {
            $idu = $quizzes[0]->maxqid;
        }
    }
    if (isset($_POST["valid"])) {
        //am submis formularul
        $idu = $_POST["quizId"] - 0;
    }
    $check = true;
    if (isset($_POST["valid1"])) {
        $idu = $_POST["quizId1"] - 0;
        $check &= modify_option($idu, 'title', 'titleArea');
        $check &= modify_option($idu, 'description', 'descriptionArea');
        $check &= modify_option($idu, 'difficulty', 'difficulty');
        $check &= modify_option($idu, 'random_questions', 'randomQuestions');
        $check &= modify_option($idu, 'random_answers', 'randomAnswers');
        $check &= modify_option($idu, 'answer_question', 'answerQuestion');
        $check &= modify_option($idu, 'next_question', 'nextQuestion');
        $check &= modify_option($idu, 'finish_quiz', 'finishQuiz');
        $check &= modify_option($idu, 'correct_answer_message', 'correctAnswerMessage');
        $check &= modify_option($idu, 'wrong_answer_message', 'wrongAnswerMessage');
        $check &= modify_option($idu, 'correct_color', 'correctColor');
        $check &= modify_option($idu, 'wrong_color', 'wrongColor');
        $check &= modify_option($idu, 'neutral_color', 'neutralColor');
        $check &= modify_option($idu, 'main_color', 'mainColor');
        if ($check) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . __('Quiz updated', 'knq') . '</strong></p></div>';
        } else {
            echo '<div class="notice notice-error is-dismissible"><p><strong>' . __('Error updating quiz', 'knq') . '</strong></p></div>';
        }
    }
    if (isset($_POST["valid3"])) {
        $idu = $_POST["quizId3"] - 0;
        for ($i = 1; $i <= $_POST['questions_counter']; $i++) {
            $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq SET order_id=" . $i . " WHERE quiz_id=" . $idu . " AND knq_id='" . $_POST['question_id_' . $i] . "'")
            );
        }
    }
    if (isset($_POST["valid4"])) {
        $qid = $wpdb->get_row($wpdb->prepare("SELECT MAX(quiz_id) AS counter FROM " . $wpdb->prefix . "knq_details"))->counter - 0;
        $qid++;
        $idu = $qid;
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'title', '" . __('Demo quiz (please configure)', 'knq') . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'description', '" . __('Demo description (please configure)', 'knq') . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'user_id', '" . (_wp_get_current_user()->ID - 0) . "')")
        );
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $qid . ", 'created', NOW())")
        );
    }
    $quizuri = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT quiz_id, option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id!=0 AND option_name='title' ORDER BY option_value"));

    foreach ($quizuri as $quiz) {
        $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quiz->quiz_id . " AND option_name='title'"));
        $codform .= '<option value="' . $quiz->quiz_id . '"' . ($quiz->quiz_id == $idu ? 'selected' : '') . '>' . (count($title) == 0 ? 'Chestionar ' : $title[0]->option_value) . " [id:" . $quiz->quiz_id . "]</option>";
    }
    $codform .= '</select>';
    $codform .= '</form>';

    $codform .= '<form method="post" action="" novalidate="novalidate"><input type="hidden" name="valid4" value="1" /><input type="submit" class="button button-primary" value="' . __("Add new quiz", "knq") . '" id="addNewQuiz"></form>';

    // daca am ales un quiz
    //am submis formularul
    $quizId = $idu;

    $codform .= "<br>";
    $codform2 = '<form method="post" action="" onsubmit="return checkQuizFormData()" novalidate="novalidate"><input type="hidden" name="valid1" value="1" /><input type="hidden" name="quizId1" value="' . $quizId . '" />';

    $codform2 .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;

    $title = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='title'"));
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    $date = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE option_name = 'created' AND quiz_id = " . $quizId));
    $codform .= $codform2 . '<center><h2>' . __("Selected quiz", "knq") . ': ' . (count($title) == 0 ? "" : $title[0]->option_value) . '</h2>(' . $user[0]->display_name . ', ' . date_i18n(get_option('date_format'), strtotime($date[0]->option_value)) . ', ' . date_i18n(get_option('time_format'), strtotime($date[0]->option_value)) . ')</center><br>' .
        '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='titleArea'>" . __('Title', 'knq') . ":</label></td><td><input type='text' size=50 name='titleArea' id='titleArea' value='" . (count($title) == 0 ? "" : $title[0]->option_value) . "'></td></tr>";

    // $scores = $wpdb->get_results($wpdb->prepare("SELECT score,timestamp,attempts,wp_knq_user_scores.quiz_id,display_name,option_value FROM " . $wpdb->prefix . "knq_user_scores, " . $wpdb->prefix . "users, " . $wpdb->prefix . "knq_details WHERE (" . $wpdb->prefix . "knq_user_scores.user_id=" . $wpdb->prefix . "users.ID AND " . $wpdb->prefix . "knq_user_scores.quiz_id=" . $wpdb->prefix . "knq_details.quiz_id AND option_name='title') ORDER BY timestamp DESC limit 25");
    $user = $wpdb->get_results($wpdb->prepare("SELECT display_name, option_value FROM " . $wpdb->prefix . "knq_details, " . $wpdb->prefix . "users WHERE " . $wpdb->prefix . "knq_details.option_name = 'user_id' AND " . $wpdb->prefix . "knq_details.quiz_id = " . $quizId . " AND " . $wpdb->prefix . "users.ID = " . $wpdb->prefix . "knq_details.option_value"));
    if (count($user) == 0) {
        $wpdb->query(
            $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", 'user_id', 1)")
        );
    }


    $description = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='description'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='descriptionArea'>" . __('Description', 'knq') . ":</label></td><td><label><textarea rows='5' cols='100' name='descriptionArea' id='descriptionArea'>" . (count($description) == 0 ? "" : $description[0]->option_value) . "</textarea></td></tr>";

    $globalDifficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='difficulty'"));
    if (count($globalDifficulty) == 0) {
        $globalDifficulty = '3';
    } else {
        $globalDifficulty = $globalDifficulty[0]->option_value;
    }
    $difficulty = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='difficulty'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='difficulty'>" . __("Difficulty level", "knq") . ":</label></td><td><select id='difficulty' name='difficulty'><option " . (count($difficulty) == 0 ? "selected" : "") . " value='0'>" . __('Global value', 'knq') . " (" . $globalDifficulty . ")</option><option value='1'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 1 ? 'selected' : '') . ">1</option><option value='2'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 2 ? 'selected' : '') . ">2</option><option value='3'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 3 ? 'selected' : '') . ">3</option><option value='4'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 4 ? 'selected' : '') . ">4</option><option value='5'" . (count($difficulty) != 0 && $difficulty[0]->option_value == 5 ? 'selected' : '') . ">5</option></select></td></tr>";

    $globalShuffleQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_questions'"));
    if (count($globalShuffleQuestions) == 0) {
        $globalShuffleQuestions = '0';
    } else {
        $globalShuffleQuestions = $globalShuffleQuestions[0]->option_value;
    }
    $randomQuestions = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='random_questions'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='randomQuestions'>" . __("Shuffle questions", "knq") . ":</label></td><td><select id='randomQuestions' name='randomQuestions'><option " . (count($randomQuestions) == 0 ? "selected" : "") . " value='-1'>" . __('Global value', 'knq') . " (" . ($globalShuffleQuestions == '0' ? __("No", "knq") : __("Yes", "knq")) . ")</option><option value='1'" . (count($randomQuestions) != 0 && $randomQuestions[0]->option_value == 1 ? 'selected' : '') . ">" . __("Yes", "knq") . "</option><option value='0'" . (count($randomQuestions) != 0 && $randomQuestions[0]->option_value == 0 ? 'selected' : '') . ">" . __("No", "knq") . "</option></select></td></tr>";

    $globalShuffleAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='shuffle_answers'"));
    if (count($globalShuffleAnswers) == 0) {
        $globalShuffleAnswers = '0';
    } else {
        $globalShuffleAnswers = $globalShuffleAnswers[0]->option_value;
    }
    $randomAnswers = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='random_answers'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='randomAnswers'>" . __("Shuffle answers", "knq") . ":</label></td><td><select id='randomAnswers' name='randomAnswers'><option " . (count($randomAnswers) == 0 ? "selected" : "") . " value='-1'>" . __('Global value', 'knq') . " (" . ($globalShuffleAnswers == '0' ? __("No", "knq") : __("Yes", "knq")) . ")</option><option value='1'" . (count($randomAnswers) != 0 && $randomAnswers[0]->option_value == 1 ? 'selected' : '') . ">" . __("Yes", "knq") . "</option><option value='0'" . (count($randomAnswers) != 0 && $randomAnswers[0]->option_value == 0 ? 'selected' : '') . ">" . __("No", "knq") . "</option></select></td></tr>";

    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td colspan="2"><strong>' . __('Leave following inputs empty if you wish to use the global value', 'knq') . ':</strong></td></tr>';

    $globalAnswerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='answer_question'"));
    if (count($globalAnswerQuestion) == 0) {
        $globalAnswerQuestion = 'Done!';
    } else {
        $globalAnswerQuestion = $globalAnswerQuestion[0]->option_value;
    }
    $answerQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='answer_question'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='answerQuestion'>" . __("Text button for answering a question", "knq") . ":</label></td><td><input id='answerQuestion' name='answerQuestion' value='" . (count($answerQuestion) == 0 ? '' : $answerQuestion[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='answerQuestion'>" . __('Global value', 'knq') . ": " . $globalAnswerQuestion . "</label></td></tr>";

    $globalNextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='next_question'"));
    if (count($globalNextQuestion) == 0) {
        $globalNextQuestion = 'Next!';
    } else {
        $globalNextQuestion = $globalNextQuestion[0]->option_value;
    }
    $nextQuestion = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='next_question'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='nextQuestion'>" . __("Text button next question", "knq") . ":</label></td><td><input id='nextQuestion' name='nextQuestion' value='" . (count($nextQuestion) == 0 ? '' : $nextQuestion[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='nextQuestion'>" . __('Global value', 'knq') . ": " . $globalNextQuestion . "</label></td></tr>";

    $globalFinishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='finish_quiz'"));
    if (count($globalFinishQuiz) == 0) {
        $globalFinishQuiz = 'Next!';
    } else {
        $globalFinishQuiz = $globalFinishQuiz[0]->option_value;
    }
    $finishQuiz = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='finish_quiz'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='finishQuiz'>" . __("Text button finish quiz", "knq") . ":</label></td><td><input id='finishQuiz' name='finishQuiz' value='" . (count($finishQuiz) == 0 ? '' : $finishQuiz[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='finishQuiz'>" . __('Global value', 'knq') . ": " . $globalFinishQuiz . "</label></td></tr>";

    $globalCorrectAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_answer_message'"));
    if (count($globalCorrectAnswerMessage) == 0) {
        $globalCorrectAnswerMessage = 'Next!';
    } else {
        $globalCorrectAnswerMessage = $globalCorrectAnswerMessage[0]->option_value;
    }
    $correctAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='correct_answer_message'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='correctAnswerMessage'>" . __("Message when answered correctly", "knq") . ":</label></td><td><input id='correctAnswerMessage' name='correctAnswerMessage' value='" . (count($correctAnswerMessage) == 0 ? '' : $correctAnswerMessage[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='correctAnswerMessage'>" . __('Global value', 'knq') . ": " . $globalCorrectAnswerMessage . "</label></td></tr>";

    $globalWrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_answer_message'"));
    if (count($globalWrongAnswerMessage) == 0) {
        $globalWrongAnswerMessage = 'Next!';
    } else {
        $globalWrongAnswerMessage = $globalWrongAnswerMessage[0]->option_value;
    }
    $wrongAnswerMessage = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='wrong_answer_message'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='wrongAnswerMessage'>" . __("Message when answered wrongly", "knq") . ":</label></td><td><input id='wrongAnswerMessage' name='wrongAnswerMessage' value='" . (count($wrongAnswerMessage) == 0 ? '' : $wrongAnswerMessage[0]->option_value) . "'/><label style='margin-left: 0.5vw' for='wrongAnswerMessage'>" . __('Global value', 'knq') . ": " . $globalWrongAnswerMessage . "</label></td></tr>";

    $globalCorrectColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='correct_color'"));
    if (count($globalCorrectColor) == 0) {
        $globalCorrectColor = '#B1D9BC';
    } else {
        $globalCorrectColor = $globalCorrectColor[0]->option_value;
    }
    $correctColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='correct_color'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='correctColor'>" . __("Correct color", "knq") . ":</label></td><td style='display: flex; margin: auto;'><input style='height: fit-content' id='correctColor' name='correctColor' value='" . (count($correctColor) == 0 ? $globalCorrectColor : $correctColor[0]->option_value) . "'/><div id='correctColorPicker'></div><input readonly style='margin-left: 0.5vw; height: fit-content; background-color: " . $globalCorrectColor . "' value='" . __('Global value', 'knq') . ": " . $globalCorrectColor . "'></td></tr>";

    $globalWrongColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='wrong_color'"));
    if (count($globalWrongColor) == 0) {
        $globalWrongColor = '#FAB6B6';
    } else {
        $globalWrongColor = $globalWrongColor[0]->option_value;
    }
    $wrongColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='wrong_color'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='wrongColor'>" . __("Wrong color", "knq") . ":</label></td><td style='display: flex; margin: auto;'><input style='height: fit-content' id='wrongColor' name='wrongColor' value='" . (count($wrongColor) == 0 ? $globalWrongColor : $wrongColor[0]->option_value) . "'/><div id='wrongColorPicker'></div><input readonly style='margin-left: 0.5vw; height: fit-content; background-color: " . $globalWrongColor . "' value='" . __('Global value', 'knq') . ": " . $globalWrongColor . "'></td></tr>";

    $globalNeutralColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='neutral_color'"));
    if (count($globalNeutralColor) == 0) {
        $globalNeutralColor = '#F4F4F4';
    } else {
        $globalNeutralColor = $globalNeutralColor[0]->option_value;
    }
    $neutralColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='neutral_color'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='neutralColor'>" . __("Neutral color", "knq") . ":</label></td><td style='display: flex; margin: auto;'><input style='height: fit-content' id='neutralColor' name='neutralColor' value='" . (count($neutralColor) == 0 ? $globalNeutralColor : $neutralColor[0]->option_value) . "'/><div id='neutralColorPicker'></div><input readonly style='margin-left: 0.5vw; height: fit-content; background-color: " . $globalNeutralColor . "' value='" . __('Global value', 'knq') . ": " . $globalNeutralColor . "'></td></tr>";

    // #FFF9B9

    $globalMainColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=0 AND option_name='main_color'"));
    if (count($globalMainColor) == 0) {
        $globalMainColor = '#FFF9B9';
    } else {
        $globalMainColor = $globalMainColor[0]->option_value;
    }
    $mainColor = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $quizId . " AND option_name='main_color'"));
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%><label for='mainColor'>" . __("Main color", "knq") . ":</label></td><td style='display: flex; margin: auto;'><input style='height: fit-content' id='mainColor' name='mainColor' value='" . (count($mainColor) == 0 ? $globalMainColor : $mainColor[0]->option_value) . "'/><div id='mainColorPicker'></div><input readonly style='margin-left: 0.5vw; height: fit-content; background-color: " . $globalMainColor . "' value='" . __('Global value', 'knq') . ": " . $globalMainColor . "'></td></tr>";

//    $codform .= add_option();

    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20%></td><td><input type='submit' style='margin-top: 0.5vw' class='button button-primary' value='" . __('Update Quiz', 'knq') . "' id='updateQuiz'></td></tr>";
    $codform .= "</table></form><br>";

    $intrebari = $wpdb->get_results($wpdb->prepare("SELECT DISTINCT knq_id, question, order_id FROM " . $wpdb->prefix . "knq WHERE quiz_id=" . $quizId . "  ORDER BY order_id"));
    $codform .= '<form method="post" action="" onsubmit="return reorderQuestions();" novalidate="novalidate"><input type="hidden" name="questions_counter" value="' . count($intrebari) . '"><input type="hidden" name="valid3" value="1" /><input type="hidden" name="quizId3" value="' . $quizId . '" />';
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $mockId = 1;
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td width="20%">' . __("Reorder questions", "knq") . ':</td><td><div id="questions">';
    foreach ($intrebari as $intrebare) {
        $codform .= '<div style="margin-top: 1vw; margin-bottom: 1vw;" class="question" id="question' . $mockId . '"><i style="margin-right: 1vw" class="fa-solid fa-arrows-up-down"></i><input type="hidden" name="question_id_' . $mockId . '" value="' . $intrebare->knq_id . '"><input class="question_text" type="text" size="50" readonly value="' . $intrebare->question . '"></div>';
        $mockId++;
    }
    $codform .= '</div></td></tr><tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td width="20%"></td><td><input type="submit" style="margin-top: 0.5vw" class="button button-primary" value="' . __("Update order of questions", "knq") . '" id="updateQuestionOrder"></td></tr></table></form><br>';

    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $i = 1;
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - just the quiz", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1]'></td></tr>";
    $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '">' . "<td width=20% style='vertical-align:middle;'><label for='randomAnswers'>" . __("Shortcode - the quiz with title and the description", "knq") . ":</label></td><td style='vertical-align:middle;'><input type=text size=50 onfocus='this.select();' onmouseup='return false;' readonly value='[kqn id=$quizId title=1 description=1]'></td></tr>";
    $codform .= "</table><br>";

    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= "<tr class=inactive><td width=20% style='vertical-align:middle;'>" . __("Be careful! When you delete a quizz, there is no undo!", "knq") . "</td><td style='vertical-align:middle;'><form method='post' action='' novalidate='novalidate'><input type='submit' class='button button-secondary' style='background-color: #dc3545; border-color: #dc3545; color: white;' id='removeQuiz' value='" . __("Delete quizz", "knq") . "' onclick='return confirm(\"" . __('Are you sure? There is no undo to that!', 'knq') . "\");'><input type='hidden' name='valid2' value='1'><input type='hidden' name='quizId2' value='" . $quizId . "' /></form></td></tr></table>";
    echo $codform;
    echo '</div>';
}

function modify_option($idu, $option_name, $object_name)
{
    $check = true;
    global $wpdb;
    $option = $wpdb->get_results($wpdb->prepare("SELECT option_value FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='" . $option_name . "'"));
    if ($_POST[$object_name] == "") {
        if (count($option) != 0) {
            $result = $wpdb->query(
                $wpdb->prepare("DELETE FROM " . $wpdb->prefix . "knq_details WHERE quiz_id=" . $idu . " AND option_name='" . $option_name . "'")
            );
            if ($result == false || !(gettype($result) == 'integer')) {
                $check = false;
            }
        }
    } else {
        if (count($option) == 0) {
            $result = $wpdb->query(
                $wpdb->prepare("INSERT INTO " . $wpdb->prefix . "knq_details (quiz_id, option_name, option_value) VALUES (" . $idu . ", '" . $option_name . "', '" . $_POST[$object_name] . "')")
            );
            if ($result == false || !(gettype($result) == 'integer')) {
                $check = false;
            }

        } else {
            $result = $wpdb->query(
                $wpdb->prepare("UPDATE " . $wpdb->prefix . "knq_details SET option_value='" . $_POST[$object_name] . "' WHERE quiz_id=" . $idu . " AND option_name='" . $option_name . "'")
            );
            if ($result == false && $result != 0) {
                $check = false;
            }
        }
    }
    return $check;
}
