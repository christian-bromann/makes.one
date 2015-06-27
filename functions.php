<?php

// cleaning code
require_once 'inc/clean.php';
// redirection
require_once 'inc/redirects.php';

add_theme_support( 'post-thumbnails' );

define('__ROOT__', get_bloginfo('url'));

/**
 * render navigation
 * @return [string] HTML code of navigation
 */
function loadNavigation() {

    $categories = get_categories(array('hide_empty' => false, 'exclude' => 1, 'orderby' => 'slug'));
    $nav_links  = "";

    foreach ($categories as $category) {
        $nav_links .= "<li><a href=\"#!/section/".$category->slug."\">".$category->name."</a></li>";
    }

    return $nav_links;
}
