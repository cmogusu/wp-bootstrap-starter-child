import { SelectControl } from '@wordpress/components'
//const { SelectControl } = wp.components
const {registerBlockType} = wp.blocks
const { __ } = wp.i18n

const options = {
	title: __( 'Adverts', 'wp-bootstrap-starter' ),
	description : 'Select and Add an advert',
	category: 'common',
	icon : 'megaphone',
	attributes : {
		content : {
			type :'string',
			source : 'attribute',
			selector : '.ad-type',
			attribute : 'data-shortcode'
		},
	},
	supports: {
		html: false,
		customClassName : false,
		alignWide:false,
	},


	edit({attributes,classname,setAttributes,isSelected}){
		let content;

		return (
			<div classname={classname}>
				{ isSelected ?
					<SelectControl
						label="Select advert type"
						value={content}
						options={[
							{ label: 'Advert 1', value:'advert-1'},
							{ label: 'Advert 2', value:'advert-2'},
							{ label: 'Advert 3', value:'advert-3'}
						]}
						onChange={ type=>setAttributes({ content: type }) }
					/>
					: attributes.content ? '['+attributes.content+']' : '[advert-1]'
				}
			</div>
		)
	},

	save({ attributes }){		
		return <div><div class="ad-type" data-shortcode={attributes.content}>[{attributes.content}]</div></div>
	}
}

registerBlockType( 'wp-bootstrap-starter/adverts', options );
