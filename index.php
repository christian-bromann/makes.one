<?php

/**
 * The main makes1 template file.
 *
 * This template was designed by Philip Lange. Creator and programmer was
 * Christian Bromann
 *
 * @package WordPress
 * @subpackage Mezla
 */

require_once('inc/ImageWall.php');
$imageWall   = new ImageWall(array('category' => 0, 'linked' => true));

get_header();

?>

<div id="app"></div>

<?php get_footer(); ?>
