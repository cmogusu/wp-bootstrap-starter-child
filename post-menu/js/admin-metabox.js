window.xPageMenu = window.xPageMenu || {};


jQuery(function($){
	var adminMetabox = {
		prefix : window.xPageMenu.prefix,
		template : window.xPageMenu.rowTemplate,
		rowIndex : window.xPageMenu.key,
		tableElement : {},


		init : function(){
			this.tableElement = $('table.'+this.prefix);
			this.addRow = this.addRow.bind( this );
			this.reorderKeysOnSort = this.reorderKeysOnSort.bind( this );

			this.addRowOnButtonClick();
			this.deleteRow();
			this.makeSortable();
		},

		// This function listens to the button on the metabox and adds a new row when it is clicked.
		addRowOnButtonClick : function(){
			if( !this.template || this.tableElement.length<1 ){
				//console.log('Unable to find template element')
				return false;
			}

			var _this = this;

			$('.'+this.prefix+'-add-new').on('click', this.addRow ).trigger('click');
			
			this.tableElement.find('input').on( 'keypress', function( event ){
				var keycode = (event.keyCode ? event.keyCode : event.which);

				if( keycode == '13' ){
					_this.addRow( event );
					return false;
				}
			})
			
		},


		addRow : function( event ){
			event.preventDefault();

			var keyedTemplate 	= this.template.replace( /xxkeyxx/g, this.rowIndex );
			this.tableElement.find( 'tbody' ).append( keyedTemplate );
			this.rowIndex++;
		},


		deleteRow : function(){
			if( this.tableElement.length<1 ){
				return;
			}

			this.tableElement.find('.delete').on('click',function(){
				$(this).parents('tr').remove();
			})
		},


		makeSortable : function(){
			var _this = this;

			this.tableElement.find('tbody').sortable({
				axis : 'y',
				cursor : 'move',
				helper: _this.fixWidthOnSort,
				update : _this.reorderKeysOnSort,
			})
			.disableSelection()
			.stop( _this.reorderKeysOnSort );
		},

		
		fixWidthOnSort : function( event, ui ) {
			ui.children().each(function() {
				$(this).width($(this).width());
			});

			return ui;
		},


		reorderKeysOnSort: function( event, ui ){
			this.tableElement.find('tbody tr').each( function( rowIndex ){
				$( this ).find( 'input' ).each( function(){
					var name = $( this ).attr( 'name' );
					name = name.replace(/\[\d\]/, '['+rowIndex+']' );

					$( this ).attr( 'name', name );
				})
			})
		},
	};

	adminMetabox.init();
})