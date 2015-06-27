<?php

// redirect /?s to /search/
// http://txfx.net/wordpress-plugins/nice-search/
function roots_nice_search_redirect() {
    if (is_search() && strpos($_SERVER['REQUEST_URI'], '/wp-admin/') === false && strpos($_SERVER['REQUEST_URI'], '/search/') === false) {
        wp_redirect(home_url('/search/' . str_replace(array(' ', '%20'), array('+', '+'), urlencode(get_query_var('s')))), 301);
        exit();
    }
}
add_action('template_redirect', 'roots_nice_search_redirect');

function roots_search_query($escaped = true) {
    $query = apply_filters('roots_search_query', get_query_var('s'));
    if ($escaped) {
        $query = esc_attr($query);
    }
    return urldecode($query);
}

add_filter('get_search_query', 'roots_search_query');

// fix for empty search query
// http://wordpress.org/support/topic/blank-search-sends-you-to-the-homepage#post-1772565
function roots_request_filter($query_vars) {
    if (isset($_GET['s']) && empty($_GET['s'])) {
      $query_vars['s'] = " ";
    }
    return $query_vars;
}
add_filter('request', 'roots_request_filter');

// root relative URLs for everything
// inspired by http://www.456bereastreet.com/archive/201010/how_to_make_wordpress_urls_root_relative/
// thanks to Scott Walkinshaw (scottwalkinshaw.com)
function roots_root_relative_url($input) {
    $output = preg_replace_callback(
        '!(https?://[^/|"]+)([^"]+)?!',
        create_function(
            '$matches',
            // if full URL is site_url, return a slash for relative root
            'if (isset($matches[0]) && $matches[0] === site_url()) { return "/";' .
            // if domain is equal to site_url, then make URL relative
            '} elseif (isset($matches[0]) && strpos($matches[0], site_url()) !== false) { return $matches[2];' .
            // if domain is not equal to site_url, do not make external link relative
            '} else { return $matches[0]; };'
        ),
        $input
    );
    return $output;
}

if (!is_admin() && !in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php'))) {
    add_filter('wp_nav_menu', 'roots_root_relative_url');
    add_filter('bloginfo_url', 'roots_root_relative_url');
    add_filter('theme_root_uri', 'roots_root_relative_url');
    add_filter('template_directory_uri', 'roots_root_relative_url');
    add_filter('script_loader_src', 'roots_root_relative_url');
    add_filter('style_loader_src', 'roots_root_relative_url');
    add_filter('plugins_url', 'roots_root_relative_url');
    add_filter('the_permalink', 'roots_root_relative_url');
    add_filter('wp_list_pages', 'roots_root_relative_url');
    add_filter('wp_list_categories', 'roots_root_relative_url');
    add_filter('wp_nav_menu', 'roots_root_relative_url');
    add_filter('the_content_more_link', 'roots_root_relative_url');
    add_filter('the_tags', 'roots_root_relative_url');
    add_filter('get_pagenum_link', 'roots_root_relative_url');
    add_filter('get_comment_link', 'roots_root_relative_url');
}

// remove root relative URLs on any attachments in the feed
function roots_root_relative_attachment_urls() {
    if (!is_feed()) {
        add_filter('wp_get_attachment_url', 'roots_root_relative_url');
        add_filter('wp_get_attachment_link', 'roots_root_relative_url');
    }
}
add_action('pre_get_posts', 'roots_root_relative_attachment_urls');

// rewrite /wp-content/themes/theme-name/css/   to /css/
// rewrite /wp-content/themes/theme-name/js/    to /js/
// rewrite /wp-content/themes/theme-name/img/   to /img/
// rewrite /wp-content/themes/theme-name/fonts/ to /fonts/
// rewrite /wp-content/plugins/ to /plugins/
function roots_flush_rewrites() {
    global $wp_rewrite;
    $wp_rewrite->flush_rules();
}

function roots_add_rewrites($content) {
    $theme_name = next(explode('/themes/', get_stylesheet_directory()));
    global $wp_rewrite;
    $roots_new_non_wp_rules = array(
        'css/(.*)'      => 'wp-content/themes/'. $theme_name . '/$1',
        'js/(.*)'       => 'wp-content/themes/'. $theme_name . '/js/$1',
        'img/(.*)'      => 'wp-content/themes/'. $theme_name . '/img/$1',
        'fonts/(.*)'    => 'wp-content/themes/'. $theme_name . '/fonts/$1',
        'plugins/(.*)'  => 'wp-content/plugins/$1'
    );
    $wp_rewrite->non_wp_rules += $roots_new_non_wp_rules;
}
add_action('admin_init', 'roots_flush_rewrites');

function roots_clean_assets($content) {
    $theme_name = next(explode('/themes/', $content));
    $current_path = '/wp-content/themes/' . $theme_name;
    $new_path = '';
    $content = str_replace($current_path, $new_path, $content);
    return $content;
}

function roots_clean_plugins($content) {
    $current_path = '/wp-content/plugins';
    $new_path = '/plugins';
    $content = str_replace($current_path, $new_path, $content);
    return $content;
}
add_action('generate_rewrite_rules', 'roots_add_rewrites');

if (!is_admin()) {
    add_filter('plugins_url', 'roots_clean_plugins');
    add_filter('bloginfo', 'roots_clean_assets');
    add_filter('stylesheet_directory_uri', 'roots_clean_assets');
    add_filter('template_directory_uri', 'roots_clean_assets');
    add_filter('script_loader_src', 'roots_clean_plugins');
    add_filter('style_loader_src', 'roots_clean_plugins');
}
update_option('uploads_use_yearmonth_folders', 0);
update_option('upload_path', 'assets');
