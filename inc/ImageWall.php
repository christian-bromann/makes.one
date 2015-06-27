<?php

/**
 * ImageWall
 */
class ImageWall {

    // CONSTANTS
    const IMAGE_SIZE     = 'full';
    const DEFAULT_TAG    = 'article';
    const DEFAULT_ORIGIN = 'thumbnail';

    // PRIVATE VARS
    private $_html = "";

    /**
     * constructor defines vars
     * @param [array] different configs
     */
    function __construct($configs) {

        // define which tag wraps the image
        $this->tag = array_key_exists('tag',$configs) ? $configs['tag'] : ImageWall::DEFAULT_TAG;

        // define origin of images
        $this->origin = array_key_exists('origin',$configs) ? $configs['origin'] : ImageWall::DEFAULT_ORIGIN;

        // get images from catgegories
        $this->categories = array_key_exists('category',$configs) ? explode(',', $configs['category']) : array();

        // get images from posts
        $this->posts = array_key_exists('post',$configs) ? explode(',', $configs['post']) : array();

        // define possible wrapper tag
        $this->wrap = array_key_exists('wrap',$configs) ? $configs['wrap'] : undefined;

        // define possible wrapper tag
        $this->linked = array_key_exists('linked',$configs) && is_bool($configs['linked']) ? $configs['linked'] : false;
    }

    /**
     * [get_thumbnail_by_id description]
     * @param  [integer] $post  wordpress article object
     * @return [string]         HTML output of thumbnail
     */
    function get_thumbnail_by_post($post) {
        // define args
        $args = array('class' => '', 'alt' => trim(strip_tags($post->post_excerpt)), 'title' => trim(strip_tags($post->post_title)));
        // get thumbnail from wp api
        $thumbnail = get_the_post_thumbnail($post->ID, ImageWall::IMAGE_SIZE, $args);
        // remove with and height attributes
        $thumbnail = preg_replace('/width="[0-9]*[px]?" /', '', $thumbnail);
        $thumbnail = preg_replace('/height="[0-9]*[px]?" /', '', $thumbnail);
        $permalink = $post->post_name;

        if($this->linked) {
            return "<".$this->tag." class=\"item\"><a href=\"#!/".$permalink."\">".$thumbnail."</a></".$this->tag.">";
        }
        return "<".$this->tag." class=\"item\">".$thumbnail."</".$this->tag.">";

    }

    /**
     * get all images from CFS
     * @param  [integer] $id  post ID
     * @return [string]       HTML output of all images
     */
    function get_images_by_post_id($id) {

        global $cfs;

        $ret        = "";
        $field_data = $cfs->get(false, $id, array('format' => 'raw'));

        foreach ($field_data['images'] as $id => $row) {

            foreach ($row as $type => $content) {

                if($content === '') {
                    continue;
                }

                if($type === 'image') {
                    $alt  = get_post_meta($content,'_wp_attachment_image_alt', TRUE);
                    $path = get_post_meta($content,'_wp_attached_file', TRUE);
                    $thumbnail = "<img src=\"".get_bloginfo('template_url')."/assets/".$path."\" alt=\"".$alt."\">";
                    $permalink = $post->post_name;

                    if($this->linked) {
                        $ret .= "<".$this->tag." class=\"item\"><a href=\"#!/".$permalink."\">".$thumbnail."</a></".$this->tag.">";
                    }
                    $ret .= "<".$this->tag." class=\"item\">".$thumbnail."</".$this->tag.">";
                } else {
                    $ret .= "<".$this->tag." class=\"item\">".$content."</".$this->tag.">";
                }

            }

        }

        return $ret;
    }

    /**
     * construct image wall of categories/posts
     * @return [string] HTML code of image wall
     */
    function construct() {

        // load images from category
        if(count($this->categories)) {
            foreach($this->categories as &$category) {
                $posts = get_posts(array('numberposts' => 10000, 'category' => $category, 'orderby' => 'menu_order', 'order' => 'ASC'));
                foreach ($posts as $post) {

                    switch($this->origin) {
                        case "thumbnail": $this->_html .= $this->get_thumbnail_by_post($post);
                        break;
                        case "post": $this->_html .= $this->get_images_by_post_id($post->ID);
                        break;
                    }

                }
            }
        }

        // load images from posts
        if(count($this->posts)) {
            foreach($this->posts as $post_id) {
                $post = get_post($post_id);
                switch($this->origin) {
                    case "thumbnail": $this->_html .= $this->get_thumbnail_by_post($post);
                    break;
                    case "post": $this->_html .= $this->get_images_by_post_id($post->ID);
                    break;
                }

            }
        }

        // wrap images if desired
        if($this->_html != "" && $this->wrap != undefined) {
            $this->_html = "<".$this->wrap.">".$this->_html."</".$this->wrap.">";
        }

        return $this->_html;
    }

    /**
     * wrapper to print image wall
     * @param  [array] different configs
     */
    function render() {
        echo $this->construct();
    }

}
