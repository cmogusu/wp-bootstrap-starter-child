<?php 
namespace post_menu;
require_once('post-inner-menu.php');

class display_menu extends post_inner_menu{
    private $has_printed_menu_content = false;


	public function __construct(){
        $this->add_hooks();
    }


    private function add_hooks(){
    	add_shortcode( 'postmenu', [$this, 'display_menu'] );
    	add_action( 'wp_enqueue_scripts', [$this,'enqueue_scripts'] );
    	add_filter( 'mce_buttons', [$this,'register_buttons'] );
        add_filter( 'mce_external_plugins', [$this, 'enqueue_tinymce_script'] );
    }


    public function enqueue_scripts(){
    	$base_url  = get_template_directory_uri().'-child/'.basename(__DIR__);

    	wp_enqueue_style( 'sticky-post-menu', $base_url.'/css/display-menu.css', [], '0.3', 'all');
    	wp_enqueue_style( 'owlCarousel', $base_url.'/css/owl.carousel.min.css', [], '2.3.4', 'all');
    	wp_enqueue_style( 'owlCarousel-theme', $base_url.'/css/owl.theme.default.min.css', [], '2.3.4', 'all');

    	wp_enqueue_script( 'owlCarousel', $base_url.'/js/owl.carousel.min.js', ['jquery'],'2.3.4',true );
    	wp_enqueue_script( 'post-inner-menu', $base_url.'/js/display-menu.js', ['jquery', 'owlCarousel', 'sticky-top-nav'],'0.2',true );
    }


    public function display_menu(){
    	global $post;

        if( !is_singular($post) || is_front_page() || $this->has_printed_menu_content ){
            return '';
        }

    	$links_array = get_post_meta( $post->ID, $this->post_meta_key, true );

    	if( !$links_array ){
    		return 'nothing to output';
    	}

    	$html = ''.
    	'<div class="post-inner-menu-wrapper">'.
	    	'<div class="post-inner-menu">'.
	    		'<div class="owl-carousel owl-theme">';
	    			foreach( $links_array as $link_array ){
			    		$html .= ''.
			    		'<span class="nav-item item">'.
			    			'<a class="nav-link" href="'.$link_array['link'].'">'.
			    				$link_array['anchor'].
			    			'</a>'.
			    		'</span>';
				    }

				$html .= ''.
			    '</div>'.
	    	'</div>'.
	    '</div>';
    
        $this->has_printed_menu_content = true;
	    
    	return $html;
    }


    public function enqueue_tinymce_script($plugin_array){
	    $plugin_array["post_inner_menu"] =  get_template_directory_uri().'/'.basename(__DIR__).'/js/tinymce.js';
	    return $plugin_array;
	}


	public function register_buttons($buttons){
	    array_push($buttons, 'post_inner_menu');
	    return $buttons;
	}
}