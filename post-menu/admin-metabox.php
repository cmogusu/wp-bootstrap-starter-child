<?php 
namespace post_menu;

require_once('post-inner-menu.php');


class admin_metabox extends post_inner_menu{
    public function __construct(){
        $this->add_hooks();
    }


    public function enqueue_scripts(){
        $handle = $this->post_meta_key.'admin-metabox';
        $file_path  = get_template_directory_uri().'/'.basename(__DIR__).'/js/admin-metabox.js';

        wp_enqueue_script( $handle, $file_path, ['jquery','jquery-ui-sortable'],'0.2',true );
    }


    private function add_hooks(){
        add_action( 'save_post', [$this,'save'], 10, 3);
        add_action( 'add_meta_boxes', [$this,'add_meta_box'], 10, 2 );
        add_action( 'admin_enqueue_scripts', [$this,'enqueue_scripts'],10,2);
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

        $final_values = [];

        if( isset($_POST[$this->post_meta_key]) && is_array($_POST[$this->post_meta_key]) ){
            foreach( $_POST[$this->post_meta_key] as $link_anchor_array ){
                if( !is_array($link_anchor_array) ){
                    continue;
                }

                $link   = isset($link_anchor_array['link']) ? trim($link_anchor_array['link']) : false;
                $anchor = isset($link_anchor_array['anchor']) ? trim($link_anchor_array['anchor']) : false;


                if( $link && $anchor ){
                    $final_values[] = [ 
                        'link'      => $link,
                        'anchor'    => $anchor,
                    ];
                }
            }
        }

        update_post_meta( $post_id, $this->post_meta_key, $final_values );
    }


    public function render_meta_box( $post ){
        wp_nonce_field(basename(__FILE__), "meta-box-nonce");
    
        $links  = get_post_meta( $post->ID, $this->post_meta_key, true );
        $key    = 0;

        ?> 
        <table class="<?php echo $this->post_meta_key; ?> w-100"> 
            <thead>
                <tr>
                    <td width="40%" colspan="2">Link</td>
                    <td width="60%" colspan="2" class="">Anchor</td>
                </tr>
            </thead>
            <tbody>
                <?php
                    if( is_array($links) && count($links)>0 ){
                        foreach( $links as $link_anchor_array ){
                            if( !is_array($link_anchor_array) ){
                                continue;
                            }

                            extract( $link_anchor_array );
                            
                            ?>
                                <tr class="<?php echo $this->post_meta_key.'-'.$key; ?> ui-sortable">
                                    <td width="5%" class="ui-sortable-handle">
                                        <span class="dashicons-before dashicons-move"></span>
                                    </td>
                                    <td width="50%" class="link">
                                        <input class="w-100" name="<?php echo "$this->post_meta_key[$key][link]" ?>" type="text" value="<?php echo isset($link) ? $link : ''; ?>" placeholder="Add a link eg #best-houses" />
                                    </td>
                                    <td width="40%" class="anchor">
                                        <input class="w-100" name="<?php echo "$this->post_meta_key[$key][anchor]" ?>" type="text" value="<?php echo isset($anchor) ? $anchor : ''; ?>" placeholder="Add anchor text eg Best houses"/>
                                    </td>
                                    <td width="5%">
                                        <span class="delete" title="Delete this row">X</span>
                                    </td>
                                </tr>
                            <?php

                            $key++;
                        }
                    }
                ?>
             </tbody>
        </table>
        <button class="button <?php echo $this->post_meta_key; ?>-add-new">Add new row</button>

        <script type="text/javascript">
            window.xPageMenu = window.xPageMenu || {};
            window.xPageMenu.prefix = '<?php echo $this->post_meta_key; ?>';
            window.xPageMenu.key = <?php echo ++$key; ?>;
            window.xPageMenu.rowTemplate = '\
            <tr>\
                <td width="5%">\
                    <span class="dashicons-before dashicons-move"></span>\
                </td>\
                <td width="50%">\
                    <input class="w-100" name="<?php echo "$this->post_meta_key[xxkeyxx][link]" ?>" type="text" value="" placeholder="Add a link eg #best-houses"/>\
                </td>\
                <td width="40%">\
                    <input class="w-100" name="<?php echo "$this->post_meta_key[xxkeyxx][anchor]" ?>" type="text" value="" placeholder="Add anchor text eg Best houses"/>\
                </td>\
                <td width="5%">\
                    <span class="delete" title="Delete this row">X</span>\
                </td>\
            </tr>';
        </script>
        <style type="text/css">
            .w-100{width:100%}.aligncenter{text-align:center;}
            .<?php echo $this->post_meta_key; ?> .delete{
                padding:5px 10px;
                background:#eee;
                border-radius:0.2em;
            }
            .<?php echo $this->post_meta_key; ?> input{
                padding: 10px;
                border-radius: 0.2em;
            }
            button.<?php echo $this->post_meta_key; ?>-add-new.button{
                margin-top: 15px;
            }
        </style>
        <?php
    }


    public function add_meta_box(){
        global $post;
        
        if( !current_user_can("edit_post", $post->ID) ){
            return false;
        }
        
        $page_types = ['post','page'];

        foreach( $page_types as $page_type ){
            add_meta_box( 
                'anchor-links',
                __('Anchor Links Bar'),
                [$this,'render_meta_box'],
                $page_type,
                'normal',
                'default'
            );
        }
    }
}