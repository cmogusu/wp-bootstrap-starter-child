(function() {
    tinymce.PluginManager.add('post_inner_menu', function( editor, url ) {
        editor.addButton( 'post_inner_menu', {
            text: 'Menu',
            icon: 'pluscircle',
            onclick: function() {
                editor.insertContent( '[postmenu]');
            },
        });
    });
 
})();
//template