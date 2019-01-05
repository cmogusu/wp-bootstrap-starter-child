<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package wp-bootstrap-starter
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 */
function adverts_block_init() {
	// Skip block registration if Gutenberg is not enabled/merged.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = get_template_directory() . '-child/blocks';

	$index_js = 'adverts/built/index.js';
	wp_register_script(
		'adverts-block-editor',
		get_theme_file_uri() . "/blocks/$index_js",
		//'http://localhost:9000/index.js',
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);


	register_block_type( 'wp-bootstrap-starter/adverts', array(
		'editor_script' => 'adverts-block-editor',
	) );

}
add_action( 'init', 'adverts_block_init' );
