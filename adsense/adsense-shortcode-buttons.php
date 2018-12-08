<?php
namespace adsense;

class adsense_shortcode_buttons{
	public function __construct(){
        $this->add_hooks();
    }


    private function add_hooks(){
        add_filter( 'mce_buttons', [$this,'register_buttons'] );
        add_filter( 'mce_external_plugins', [$this, 'enqueue_scripts'] );
    }

	
	public function enqueue_scripts($plugin_array){
	    $plugin_array["adsense_shortcode"] =  get_template_directory_uri().'/adsense/tinymce.js';
	    return $plugin_array;
	}


	public function register_buttons($buttons){
	    array_push($buttons, 'adsense_shortcode');
	    return $buttons;
	}
}