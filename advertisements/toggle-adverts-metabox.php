<?php 
namespace advertisements;

class toggle_adverts_metabox{
    private $nonce_name = 'adsense_nonce';


	public function __construct(){
        $this->add_hooks(); 
    }


    private function add_hooks(){
        add_action( "save_post", [$this,'save'], 10, 3);
        add_action( 'add_meta_boxes', [$this,'add_meta_box'], 10, 2 );
    }


    public function save( $post_id, $post, $update ){
        if( !isset($_POST["meta-box-nonce"]) || !wp_verify_nonce($_POST[$this->nonce_name],basename(__FILE__)) ){
            return $post_id; 
        }
        
        if( !current_user_can("edit_post", $post_id) ){
            return $post_id;
        }

        if( defined("DOING_AUTOSAVE") && DOING_AUTOSAVE ){
            return $post_id;
        }
        

       	$value = (isset($_POST['show_adverts']) && $_POST['show_adverts']=='on') ? 'show' : 'hide';
 
        update_post_meta( $post->ID, 'show_adsense_ad', $value );
    }


    public function render_meta_box( $post ){
        wp_nonce_field(basename(__FILE__), $this->nonce_name);
    
        $post_meta = get_post_meta( $post->ID, 'show_adsense_ad', true );

        if( !$post_meta ){
        	$post_meta = 'show';
        }
        
        ?>
			<div class="theAccordion">
				<input type="checkbox" id="show-adsense-ad" name="show_adverts" 
				<?php echo ($post_meta=='show') ? 'checked="checked"' : ''; ?> />
				Show advert after paragraph 1 </br>
			</div>
		<?php
    }


    public function add_meta_box(){
    	$page_types = ['post','page'];

    	foreach( $page_types as $page_type ){
    		add_meta_box( 
	            'toggle-adsense-ad',
	            __('Toggle Advertisements'),
	            [$this,'render_meta_box'],
	            $page_type,
	            'side',
	            'high'
	        );
    	}
    }
}