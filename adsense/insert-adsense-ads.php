<?php
namespace adsense;

class insert_adsense_ads{
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
	    $replace 	= '
			<div class="ad ad2nd">
				<script async type="text/javascript" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
			    <ins class="adsbygoogle"
			        style="display:block;text-align:center;"
			        data-ad-layout="in-article"
			        data-ad-format="fluid"
			        data-ad-client="'.$this->client_id.'"
			        data-ad-slot="4527510283"></ins>
			    <script>
			        (adsbygoogle=window.adsbygoogle || []).push({})
			    </script>
			</div>';

		
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
	    return '
	    	<div class="ad ad1">.
				<script async type="text/javascript" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<ins class="adsbygoogle"
				    style="display:block;text-align:center;"
				    data-ad-layout="in-article"
				    data-ad-format="fluid"
				    data-ad-client="'.$this->client_id.'"
				    data-ad-slot="4527510283"></ins>
				<script>
				    (adsbygoogle=window.adsbygoogle || []).push({})
				</script>
			</div>';
	}


	public function ads2(){
	    return '
			<div class="ad ad300a" data-ad="Shortcode [ad300b] Ad">
			    <script async type="text/javascript" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
			    <ins class="adsbygoogle"
			        style="display:block;text-align:center;"
			        data-ad-layout="in-article"
			        data-ad-format="fluid"
			        data-ad-client="'.$this->client_id.'"
			        data-ad-slot="4527510283"></ins>
			    <script>
			        (adsbygoogle=window.adsbygoogle || []).push({})
			    </script>
			</div>';
	}


	public function ads3(){
		return '
			<div class="ad ad300b" data-ad="Shortcode [ad468] Ad">
			    <script async type="text/javascript" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
			    <ins class="adsbygoogle"
			        style="display:block;text-align:center;"
			        data-ad-layout="in-article"
			        data-ad-format="fluid"
			        data-ad-client="'.$this->client_id.'"
			        data-ad-slot="4527510283"></ins>
			    <script>
			        (adsbygoogle=window.adsbygoogle || []).push({})
			    </script>
			</div>';

	}
}