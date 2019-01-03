<?php
namespace advertisements;

class insert_adverts{
	private $client_id = 'ca-pub-xxx';
	private $content_has_image = false;

	public function __construct(){
        $this->add_hooks();
    }


    private function add_hooks(){
    	add_filter('the_content', [$this,'process_content'],20 );
    	add_shortcode( 'ad300a', [$this,'ads1'] );
    	add_shortcode( 'ad300b',[$this,'ads2'] );
    	add_shortcode( 'ad468', [$this,'ads3'] );
    }


	public function process_content( $content ){
		global $post;

		$show_ad 	= get_post_meta( $post->ID, 'show_adsense_ad', true );


	    if( $show_ad=='hide' ){
	        return $content;
	    }

	    
	    $needle 	= '</p>';
	    
	    ob_start();
		require( __DIR__.'/templates/template-default.php' );
		$replace = ob_get_clean();

		
	    $first_paragraph_end_pos = strpos($content,$needle);

	    if( !$first_paragraph_end_pos ){
	    	return $content;
	    }

    	$first_paragraph 		 = substr( $content, 0, $first_paragraph_end_pos );


    	//check if first paragraph has any images
    	$first_paragraph 	= preg_replace_callback('#\<img([^>]*)>#si', function ($match) use ($replace){

    		$image = $this->content_has_image ? $match[0] : $match[0].$replace;
    		$image = str_ireplace( 'alignleft', '', $image );
    		$image = str_ireplace( 'alignright', '', $image );
		    $this->content_has_image = true;

		    return $image;
		}, $first_paragraph );


    	$final_content 				= $first_paragraph . substr( $content, $first_paragraph_end_pos );

    	//if an image was found, we return the content
		if( $this->content_has_image ){
			return $final_content;
		}    	


    	$replace 		= $needle.$replace;
    	$final_content 	= substr_replace($content, $replace, $first_paragraph_end_pos, strlen($needle));
	

	    return $final_content;
	}
	

	public function ads1(){
		ob_start();
		require( __DIR__.'/templates/template-ad1.php' );
		return ob_get_clean();
	}


	public function ads2(){
		ob_start();
		require( __DIR__.'/templates/template-ad2.php' );
		return ob_get_clean();
	}


	public function ads3(){
		ob_start();
		require( __DIR__.'/templates/template-ad3.php' );
		return ob_get_clean();
	}
}