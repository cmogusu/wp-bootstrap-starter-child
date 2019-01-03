<?php
namespace advertisements;

class adverts_shortcode_buttons{
	public function __construct(){
        $this->add_hooks();
    }


    private function add_hooks(){
        add_filter( 'mce_buttons', [$this,'register_buttons'] );
        add_filter( 'mce_external_plugins', [$this, 'enqueue_scripts'] );
    }

	
	public function enqueue_scripts($plugin_array){
	    $plugin_array["adverts_shortcode"] =  get_theme_file_uri().'/advertisements/tinymce.js?v=5';
	    return $plugin_array;
	}


	public function register_buttons($buttons){
	    array_push($buttons, 'adverts_shortcode');
	    return $buttons;
	}
}