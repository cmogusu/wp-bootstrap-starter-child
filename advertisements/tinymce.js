(function() {
    tinymce.PluginManager.add('adverts_shortcode', function( editor, url ) {
        editor.addButton( 'adverts_shortcode', {
            text: ' Adverts',
            icon: 'backcolor',
            onclick: function() {
                editor.windowManager.open( {
                    title: 'Please select the type of advertisement',
                    body: [
                        {
                            type   : 'listbox',
                            name   : 'shortcode_no',
                            label  : 'Type : ',
                            values : [
                                { text: 'Advert 1', value: 'advert-1' },
                                { text: 'Advert 2', value: 'advert-2' },
                                { text: 'Advert 3', value: 'advert-3' }
                            ],
                            value : 'ad300a' // Sets the default
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