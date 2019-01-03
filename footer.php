<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WP_Bootstrap_Starter
 */

?>
<?php if(!is_page_template( 'blank-page.php' ) && !is_page_template( 'blank-page-with-container.php' )): ?>
			</div><!-- .row -->
		</div><!-- .container -->
	</div><!-- #content -->
    <?php get_template_part( 'footer-widget' ); ?>
	<footer id="colophon" class="site-footer <?php echo wp_bootstrap_starter_bg_class(); ?>" role="contentinfo">
		<div class="container pt-3 pb-3">
            <div class="site-info">
                &copy; <?php echo date('Y'); ?> <?php echo '<a href="'.home_url().'">'.get_bloginfo('name').'</a>'; ?>
                <span class="sep"> | </span>
                <a class="credits" href="https://afterimagedesigns.com/wp-bootstrap-starter/" target="_blank" title="Wordpress Technical Support" alt="Bootstrap Wordpress Theme"><?php echo esc_html__('Bootstrap Wordpress Theme','wp-bootstrap-starter'); ?></a>

            </div><!-- close .site-info -->
		</div>
	</footer><!-- #colophon -->
<?php endif; ?>
</div><!-- #page -->

<style>
.ad{
	position:relative;
	background: #f1e5e5;
}
.ad:before{
	content: attr(data-ad);
	position: absolute;
	padding: 20px;
	bottom: 0;
	right:0;
}

.ad2nd:before{
	content: 'End of Paragraph 1 Ad';
}
.ad1:before{
	content: 'Shordcode [advert-1] Ad';
}
.ad300a:before{
	content: 'Shortcode [advert-2] Ad';
}
.ad300b:before{
	content: 'Shortcode [advert-3] Ad';
}
</style>
<?php wp_footer(); ?>
</body>
</html>