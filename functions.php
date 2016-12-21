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

function getFieldsForPost( $data ) {
    global $cfs;
    $fields = $cfs->get(false, $data['id'], array('format' => 'raw'));
    $ret = array();

    if (empty($fields['images'])) {
        return new WP_Error('no_images', 'No images found', array( 'status' => 404 ));
    }

    foreach ($fields['images'] as $id => $row) {
        foreach ($row as $type => $content) {
            if($content === '') {
                continue;
            }

            if($type === 'image') {
                $image = wp_get_attachment_metadata(intval($content), TRUE);
                $image['type'] = $type;
                array_push($ret, $image);
            } else {
                array_push($ret, (object) array(
                    'type' => $type,
                    'content' => $content
                ));
            }
        }
    }

	return $ret;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'makes/v1', '/fields/(?P<id>\d+)', array(
		'methods' => 'GET',
		'callback' => 'getFieldsForPost',
	) );
} );
