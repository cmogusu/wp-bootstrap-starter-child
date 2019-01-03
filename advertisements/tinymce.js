(function() {
    tinymce.PluginManager.add('adverts_shortcode', function( editor, url ) {
        editor.addButton( 'adverts_shortcode', {
            text: 'Advertisement',
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
                                { text: 'Ad300a', value: 'ad300a' },
                                { text: 'Ad300b', value: 'ad300b' },
                                { text: 'Ad468', value: 'ad468' }
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