<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WP_Bootstrap_Starter
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'wp-bootstrap-starter' ); ?></a>
    <?php if(!is_page_template( 'blank-page.php' ) && !is_page_template( 'blank-page-with-container.php' )): ?>
	<header id="masthead" class="site-header navbar-static-top <?php echo wp_bootstrap_starter_bg_class(); ?>" role="banner">
        <div class="container">
            <nav class="navbar navbar-expand-lg justify-content-start p-0">
                <div class="wps-toggle wps-menu-toggle left relative">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="navbar-brand">
                    <?php if ( get_theme_mod( 'wp_bootstrap_starter_logo' ) ): ?>
                        <a href="<?php echo esc_url( home_url( '/' )); ?>">
                            <img src="<?php echo esc_attr(get_theme_mod( 'wp_bootstrap_starter_logo' )); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
                        </a>
                    <?php else : ?>
                        <a class="site-title" href="<?php echo esc_url( home_url( '/' )); ?>"><?php esc_url(bloginfo('name')); ?></a>
                    <?php endif; ?>

                </div>

                <?php
                    wp_nav_menu(array(
                        'theme_location'    => 'primary',
                        'container'       => 'div',
                        'container_id'    => 'main-nav',
                        'container_class' => 'collapse navbar-collapse justify-content-start',
                        'menu_id'         => false,
                        'menu_class'      => 'navbar-nav wps-main-menu',
                        'depth'           => 0,
                        'fallback_cb'     => 'wp_bootstrap_navwalker::fallback',
                        'walker'          => new wp_bootstrap_navwalker()
                    ));
                ?>
                
                <ul class="navbar-nav mr-right wps-social-nav">
                    <?php echo wps_get_fb_twitter_icons(); ?>
                    <li class="nav-item ml-1 search">
                        <a class="nav-link wps-toggle-search"><span class="fa fa-search"></span></a>
                    </li>
                </ul>
            </nav>
        </div>
	</header><!-- #masthead -->
    
    <!-- side drawer navigation -->
    <div>
        <nav class="wps-drawer-nav" role="navigation" style="opacity:0">
            <div class="wps-drawer-header clearfix">
                <div class="float-left">
                    <div class="navbar-brand">
                        <?php if ( get_theme_mod( 'wp_bootstrap_starter_logo' ) ): ?>
                            <a href="<?php echo esc_url( home_url( '/' )); ?>">
                                <img src="<?php echo esc_attr(get_theme_mod( 'wp_bootstrap_starter_logo' )); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
                            </a>
                        <?php else : ?>
                            <a class="site-title" href="<?php echo esc_url( home_url( '/' )); ?>"><?php esc_url(bloginfo('name')); ?></a>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="float-right">
                    <button type="button" class="wps-toggle drawer-hamburger">
                        <span class="sr-only">toggle navigation</span>
                        <span class="drawer-hamburger-icon"></span>
                    </button>
                </div>
            </div>
            <div class="wps-drawer-scroller relative">
                <div class="iscroll-wrapper">
                    <div class="iscroll-scroller">
                        <ul class="drawer-menu">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="wps-drawer-footer position-absolute" >
                <div class="wps-socials text-center w-100">
                    <span class="title d-block">Connect with us</span>
                    <ul class="wps-social-icons px-0 m-0"><?php echo wps_get_icons(); ?></ul>
                </div>
            </div>
        </nav>
        <div class="drawer-overlay drawer-toggle wps-toggle"></div>
    </div>
    <!-- side drawer navigation -->

    <div class="wps-search-wrap">
        <div class="wps-search-box">
            <form method="get" id="searchform" role="search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                <input type="search" class="wps-search-input" placeholder="<?php echo esc_attr_x( 'Search &hellip;', 'placeholder', 'wp-bootstrap-starter' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" title="<?php _ex( 'Search for:', 'label', 'wp-bootstrap-starter' ); ?>">
                <input type="hidden" id="searchsubmit" value="Search">
            </form>
        </div>
        <div class="wps-search-but-wrap wps-close-button">
            <span></span>
            <span></span>
        </div>
    </div>

    <?php if(is_front_page() && !get_theme_mod( 'header_banner_visibility' )): ?>
        <div id="page-sub-header" <?php if(has_header_image()) { ?>style="background-image: url('<?php header_image(); ?>');" <?php } ?>>
            <div class="container">
                <h1>
                    <?php
                    if(get_theme_mod( 'header_banner_title_setting' )){
                        echo get_theme_mod( 'header_banner_title_setting' );
                    }else{
                        echo 'Wordpress + Bootstrap';
                    }
                    ?>
                </h1>
                <p>
                    <?php
                    if(get_theme_mod( 'header_banner_tagline_setting' )){
                        echo get_theme_mod( 'header_banner_tagline_setting' );
                }else{
                        echo esc_html__('To customize the contents of this header banner and other elements of your site, go to Dashboard > Appearance > Customize','wp-bootstrap-starter');
                    }
                    ?>
                </p>
                <a href="#content" class="page-scroller"><i class="fa fa-fw fa-angle-down"></i></a>
            </div>
        </div>
    <?php endif; ?>

	<div id="content" class="site-content">
		<div class="container">
            <?php do_action('wp_bootstrap_starter_below_content1'); ?>
			<div class="row">
                <?php endif; ?>