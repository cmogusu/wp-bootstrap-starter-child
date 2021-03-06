<?php
add_action( 'wp_enqueue_scripts', 'wp_bootstrap_starter_child_enqueue_styles' );
function wp_bootstrap_starter_child_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' ); 
} 



/*
* This anonymous function wraps the adverts functionality
* 
* It imports the below files
* 1) The 'toggle-adverts-metabox.php' file displays a metabox with a checkbox to show or hide the advertisements 
* 2) The file : 'insert-adverts-ads.php' adds the advertisements on the post pages after the first paragraph or after the first image in every paragraph. It also sets up shortcodes that display different ads
* 3) 'adverts-shortcode-buttons.php' is a small file that adds a button to the wordpress editor. When clicked, the button makes it easier to add the advertisement shortcodes.
*/

(function(){
    require('advertisements/toggle-adverts-metabox.php');
    require('advertisements/insert-adverts.php');
    require('advertisements/adverts-shortcode-buttons.php');

    new \advertisements\toggle_adverts_metabox();
    new \advertisements\insert_adverts();
    new \advertisements\adverts_shortcode_buttons();
})();


////////////////////////////////////////  Project 1  ///////////////////////////////////////

/*
* This function wraps the featured content functionality
*/
(function(){
    // we first add hooks that will display each of the three featured content
    add_action('wp_bootstrap_starter_below_content1', 'featured_contenido1');
    add_action('wp_bootstrap_starter_below_content2', 'featured_contenido2');
    add_action('wp_bootstrap_starter_below_content3', 'featured_contenido3');


    function featured_contenido1() {
        global $wp_query;

        $paged  = (get_query_var('paged')) ? get_query_var('paged') : 1;

//echo $wp_query->post->ID; var_dump(get_post_meta( $wp_query->post->ID, 'post_featconte1', true ));die;
        if( is_singular() && get_post_meta( $wp_query->post->ID, 'post_featconte1', true ) == "show" ) {
            get_template_part( 'featured-content/templates/content', '1' );
        }
    }


    function featured_contenido2() {
        global $wp_query;


        if( is_singular() && get_post_meta( $wp_query->post->ID, 'post_featconte2', true ) == "show" ) {
            get_template_part( 'featured-content/templates/content', '2' );
        }
    }


    function featured_contenido3() {
        global $wp_query;

        if( is_singular() && get_post_meta( $wp_query->post->ID, 'post_featconte3', true ) == "show" ) {
            get_template_part( 'featured-content/templates/content', '3' );
        }
    }


    // Here we import the file 'admin-metabox.php' that displays the metabox on the post edit pages
    require('featured-content/admin-metabox.php');

    new \featured_content\admin_metabox();
})();


////////////////////////////////////////  Project 2  ///////////////////////////////////////


/* 
*  This anonymous function wraps the anchor links functionality
*/ 
(function(){

    // We first import and initaite the class that displays the metabox on the post edit page 
    require('post-menu/admin-metabox.php');
    new \post_menu\admin_metabox();


    // Next we import and initiate a class that creates the shortcode and displays the menu on the front end
    require('post-menu/display-menu.php');
    new \post_menu\display_menu();  


    // This section adds a javascript file that makes to the top navigation bar sticky
    add_action('wp_enqueue_scripts', function(){
        $base_url  = get_theme_file_uri().'/post-menu';

        wp_enqueue_script( 'sticky-top-nav', $base_url.'/js/sticky-top-nav.js', ['jquery','underscore'],'0.5',true );
    });
    
})();



////////////////////////////////////////  Project 3  ///////////////////////////////////////


/*
* Add our own set of css and jsfiles to the new child theme. 
* The files style the header and enable the menu on the left side of the screen
*/
add_action('wp_enqueue_scripts', function(){
    $base_url  = get_theme_file_uri();

    // add some js
    wp_enqueue_script('wps-iscroll', $base_url.'/js/iscroll.js', array(), '', true );
    wp_enqueue_script('wps-drawer', $base_url.'/js/drawer.js', array('wps-iscroll'), '', true );
    wp_enqueue_script('wps-nav', $base_url.'/js/navigation.js', array('wps-drawer'), '0.1', true );

    wp_dequeue_style('wp-bootstrap-pro-fontawesome-cdn');
    wp_enqueue_style( 'fontawesome', $base_url.'/css/font-awesome.min.css', '', '' );
    wp_enqueue_style( 'work-sans', 'https://fonts.googleapis.com/css?family=Work+Sans:400,600', '', '' );
}, 100 ); 


/*
* Create a page to enter the social media accounts
*/ 
add_action('admin_menu', function(){
    require_once 'admin/social-media-page.php';
    $socials = new wps_social_media_accounts();

    add_theme_page( 'Social Media Accounts', 'Social Media', 'manage_options', 'social', [$socials,'display'] );
});


/*
* Function that creates a list of the social media accounts to display on the frontend
*/
function wps_get_icons(){
    require_once 'admin/social-media-page.php';

    $socials = get_option( 'wps_socials' );
    $defaults = wps_social_media_accounts::get_defaults();
    $html = '';

    foreach( $defaults as $slug => $account ){
        if( !isset($socials[$slug]) ){
            continue;
        }

        $html .= ''.
        '<li class="list-unstyled list-inline-item '.$slug.'">'.
            '<a href="'.$socials[$slug].'" title="'.$account['title'].'" class="fa fa-'.$account['icon_front'].'">'.
            '</a>'.
        '</li>';
    }

    return $html;
}

function wps_get_fb_twitter_icons(){
    require_once 'admin/social-media-page.php';

    $socials = get_option( 'wps_socials' );
    $defaults = wps_social_media_accounts::get_defaults();
    $accounts = ['facebook','twitter','instagram','pinterest'];
    $html = '';


    foreach( $accounts as $index => $slug ) {
        if( isset($socials[$slug]) ){
            $html .= ''.
            '<li class="nav-item">'.
                '<a class="nav-link" href="'.$socials[$slug].'">'.
                    '<span class="fa fa-'.$slug.'"></span>'.
                '</a>'.
            '</li>';
        }
    }

    return $html;
}


/*
* 
* Create a new menu location
*
*/
register_nav_menus( array(
    'primary' => esc_html__( 'Primary', 'wp-bootstrap-starter-child' ),
    'drawer' => esc_html__( 'Drawer', 'wp-bootstrap-starter-child' ),
));


/*
* 
* Add gootenburg blocks to editor
*
*/
require('blocks/adverts.php');