(function() {
    tinymce.PluginManager.add('adsense_shortcode', function( editor, url ) {
        editor.addButton( 'adsense_shortcode', {
            text: 'Adsense',
            icon: 'backcolor',
            onclick: function() {
                editor.windowManager.open( {
                    title: 'Adsense title title',
                    body: [
                        {
                            type   : 'listbox',
                            name   : 'shortcode_no',
                            label  : 'Adsense',
                            values : [
                                { text: 'Ad300a', value: 'ad300a' },
                                { text: 'Ad300b', value: 'ad300b' },
                                { text: 'Ad468', value: 'ad468' }
                            ],
                            value : 'ad1' // Sets the default
                        }
                    ],
                    onsubmit: function( e ) {
                        editor.insertContent( '['+e.data.shortcode_no+']');
                    }
                });
            },
        });
    });
 
})();