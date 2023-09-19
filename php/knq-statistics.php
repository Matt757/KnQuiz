<?php

function knq_statistici()
{
    global $wpdb;
    echo '<div class="wrap">';
    echo '<div id="icon-index" class="icon32"><br /></div>';
    echo '<h2><i class="fa fa-users" aria-hidden="true"></i> ' . __('Statistics', 'knq') . '</h2><br>';
    $codform = "";
    $scores = $wpdb->get_results($wpdb->prepare("SELECT score,timestamp,attempts,wp_knq_user_scores.quiz_id,display_name,option_value FROM " . $wpdb->prefix . "knq_user_scores, " . $wpdb->prefix . "users, " . $wpdb->prefix . "knq_details WHERE (" . $wpdb->prefix . "knq_user_scores.user_id=" . $wpdb->prefix . "users.ID AND " . $wpdb->prefix . "knq_user_scores.quiz_id=" . $wpdb->prefix . "knq_details.quiz_id AND option_name='title') ORDER BY timestamp DESC limit 25"));
    $codform .= '<h3>' . __("Last played quizzes", "knq") . '</h3>';
    $codform .= '<table role="presentation" class="wp-list-table widefat plugins"><tbody id="the-list">';
    $codform .= '<tr style="background-color:#A6C4DD;"><td><strong>' . __('User', 'knq') . '</strong></td><td><strong>' . __('Score', 'knq') . '</strong></td><td><strong>' . __('Attempts', 'knq') . '</strong></td><td><strong>' . __('Quiz', 'knq') . '</strong></td><td><strong>' . __('When', 'knq') . '</td></tr>';
    $i = 1;
    foreach ($scores as $score) {
        $codform .= '<tr class="' . ($i++ % 2 == 0 ? "active" : "inactive") . '"><td>' . $score->display_name . '</td><td>' . $score->score . '</td><td>' . ($score->attempts - 0) . '</td><td>' . $score->option_value . '</td><td>' . $score->timestamp . '</td></tr>';
    }
    $codform .= '</table>';
//    $codform .= '<div style="width: 50px; height: 50px; overflow: hidden; margin: 0.1vw"><img src="http://localhost/wptest/wp-content/uploads/2023/09/tour_img-312981-148-1.jpg" style="width: 400px; margin: 0 0 0 0px"></div>';
//    $codform .= '<div style="width: 50px; height: 50px; overflow: hidden; margin: 0.1vw"><img src="http://localhost/wptest/wp-content/uploads/2023/09/tour_img-312981-148-1.jpg" style="width: 400px; margin: 0 0 0 -50px"></div>';
//    $codform .= '<div style="width: 50px; height: 50px; overflow: hidden; margin: 0.1vw"><img src="http://localhost/wptest/wp-content/uploads/2023/09/tour_img-312981-148-1.jpg" style="width: 400px; margin: 0 0 0 -100px"></div>';
    $codform .= '<div id="imagePieces"></div>';
    $codform .= '<button onclick="checkPuzzle()">Done!</button>';
    echo $codform;
    echo '</div>';
}