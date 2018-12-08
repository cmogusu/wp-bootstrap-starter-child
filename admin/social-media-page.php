<?php
class wps_social_media_accounts{
    private $option_name = 'wps_socials';


    public function __construct(){
        add_action('admin_enqueue_scripts', [$this,'add_scripts'] );
    }


    public function add_scripts(){
        $base_url  = get_template_directory_uri().'/navigation';

        wp_enqueue_style('wps-iscroll', $base_url.'/css/font-awesome.min.css' );
        wp_enqueue_style('semantica', 'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css' );
    }


    public function display(){
        if (!current_user_can('manage_options')){
            wp_die( __('You do not have sufficient permissions to access this page.') );
        }

        $socials = get_option( $this->option_name );
        $defaults = $this::get_defaults();

        if( $this->verify_nonce() && isset($_POST[$this->option_name]) ) {
            $socials = $_POST[$this->option_name];
            $finalVals = [];
            
            foreach( $socials as $social_slug => $social_account ){
                if( !isset($defaults[$social_slug]) || !trim($social_account)){
                    continue;
                }

                $finalVals[$social_slug] = (string)trim($social_account);
            }
            
            update_option( $this->option_name, $finalVals );

            ?>
                <div class="ui ignored positive message">
                    Settings saved
                </div>
            <?php
        }

        ?>
            <h2 class="ui center aligned large header">Social Media Accounts</h2>
            
            <form name="form1" method="post" action="" >
                <?php wp_nonce_field(basename(__FILE__), "wps-nonce"); ?>

                <div class="ui text container">
                    <div class="ui segments">
                        <?php foreach( $defaults as $slug => $account ): ?>
                            <div class="ui segment">
                                <div class="ui grid">
                                    <div class="four wide column">
                                        <label for="<?php echo $slug; ?>">
                                            <?php echo $account['title']; ?>
                                        </label>
                                    </div>
                                
                                    <div class="twelve wide column">
                                        <div class="ui left icon input fluid">
                                            <input 
                                                type="text"
                                                id="<?php echo $slug; ?>" 
                                                name="<?php echo $this->option_name."[$slug]"; ?>" 
                                                value="<?php if(isset($socials[$slug])) echo $socials[$slug]; ?>" 
                                                placeholder="<?php echo $account['placeholder']; ?>"
                                                size="20" />
                                            <i class="icon <?php echo $account['icon']; ?>"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                    </div>
                </div>

                <div class="ui one column centered grid" style="margin-top:40px">
                    <div class="ui segment">
                        <button class="ui button labeled icon">
                            <i class="check icon right"></i>
                            Save changes
                        </button>
                    </div>
                </div>

            </form>
            

        <?php

    }


    private function verify_nonce(){
        return ( isset($_POST["wps-nonce"]) && wp_verify_nonce($_POST["wps-nonce"],basename(__FILE__)) );
    }


    public static function get_defaults(){
        $defaults = [
            'facebook' => [
                'title' => 'Facebook',
                'placeholder' => 'https://facebook.com/',
                'icon' => 'facebook f',
                'icon_front' => 'facebook-official',
            ],
            'twitter' => [
                'title' => 'Twitter',
                'placeholder' => 'https://twitter.com/',
                'icon' => 'twitter',
                'icon_front' => 'twitter',
            ],
            'pinterest' => [
                'title' => 'Pinterest',
                'placeholder' => 'https://www.pinterest.com/',
                'icon' => 'pinterest p',
                'icon_front' => 'pinterest',
            ],
            'instagram' => [
                'title' => 'Instagram',
                'placeholder' => 'https://www.instagram.com/',
                'icon' => 'instagram',
                'icon_front' => 'instagram',
            ],
            'google_plus' => [
                'title' => 'Google+',
                'placeholder' => 'https://plus.google.com/u/0/',
                'icon' => 'google plus g',
                'icon_front' => 'google-plus',
            ],
            'youtube' => [
                'title' => 'Youtube',
                'placeholder' => 'https://www.youtube.com/channel/',
                'icon' => 'youtube',
                'icon_front' => 'youtube',
            ],
            'linkedin' => [
                'title' => 'LinkedIn',
                'placeholder' => 'https://www.linkedin.com/',
                'icon' => 'linkedin',
                'icon_front' => 'linkedin',
            ],
            'tumblr' => [
                'title' => 'Tumblr',
                'placeholder' => 'https://tumblr.com',
                'icon' => 'tumblr',
                'icon_front' => 'tumblr',
            ]
        ];

        return $defaults;
    }
}