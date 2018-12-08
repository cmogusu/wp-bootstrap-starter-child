<?php 
namespace featured_content;

class admin_metabox{
	public function __construct(){
        $this->add_hooks(); 
    }


    private function add_hooks(){
        add_action( "save_post", [$this,'save'], 10, 3);
        add_action( 'add_meta_boxes', [$this,'add_meta_box'], 10, 2 );
    }


    public function save( $post_id, $post, $update ){
        if( !isset($_POST["meta-box-nonce"]) || !wp_verify_nonce($_POST["meta-box-nonce"],basename(__FILE__)) ){
            return $post_id; 
        }
        
        if( !current_user_can("edit_post", $post_id) ){
            return $post_id;
        }

        if( defined("DOING_AUTOSAVE") && DOING_AUTOSAVE ){
            return $post_id;
        }
        

        if( isset($_POST['my_featured_content']) ){
        	foreach( $_POST['my_featured_content'] as $key => $value ){
        		if( (int)$key && ($value=='show' || $value='hide') ){
        			update_post_meta( $post_id, 'post_featconte'.$key, $value );
        		}
        	}
        }
    }


    public function render_meta_box( $post ){
        wp_nonce_field(basename(__FILE__), "meta-box-nonce");
    
        $featured1 	= get_post_meta( $post->ID, 'post_featconte1', true );
        $featured2 	= get_post_meta( $post->ID, 'post_featconte2', true );
        $featured3 	= get_post_meta( $post->ID, 'post_featconte3', true );
        
        ?> <div class="featured-content"> <?php
	        foreach( [$featured1, $featured2, $featured3] as $key => $value ){
	        	$value 	= $value ? $value : 'hide';
	        	$i 		= $key + 1;
		        ?>
			        <div class="mb-3">
			        	<strong class="font-size-90">Add featured content <?php echo $i ?></strong><br/>
			        	<p class="font-size-90 my-0">If you'd like to add featured contenido <?php echo $i ?> abajo of this page, select Yes below.</p>
						<select name="my_featured_content[<?php echo $i ?>]" class="w-100">
							<option value="hide" <?php echo ($value=='hide') ? 'selected="selected"' : ''; ?> >No</option>
							<option value="show" <?php echo ($value=='show') ? 'selected="selected"' : ''; ?> >Yes</option>
						</select>
					</div>
				<?php
			}
		?> </div> 
		<style>.w-100{width:100%;}.my-0{margin-top:5px;margin-bottom:5px;}.font-size-90{font-size:.90em;}.mb-3{margin-bottom:1.5em;}</style>
		<?php
    }


    public function add_meta_box(){
        global $post;

        // capability check 
        if( !current_user_can("edit_post", $post->ID) ){
            return false;
        }
        
    	$page_types = ['post','page'];

    	foreach( $page_types as $page_type ){
    		add_meta_box( 
	            'my-featured-content',
	            __('Additional content for this page'),
	            [$this,'render_meta_box'],
	            $page_type,
	            'side',
	            'default'
	        );
    	}
    }
}