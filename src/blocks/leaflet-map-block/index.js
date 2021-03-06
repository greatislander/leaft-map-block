const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;

import './editor.scss';

import icon from './icon';
import Inspector from './inspector';
import attributes from './attributes';

/*
* Components
*/
import LeafletMap from '../../components/leaflet-map';
import SearchPlace from '../../components/search-place';
import ResizableBox from 're-resizable';


export default registerBlockType(  'map-block-leaflet/map-block-leaflet', {
    title:__('Map Leaflet', ''),
    description: __('Easy way to inside maps in your contents', 'map-block-leaflet'),
    category: 'embed',
    keywords: [
        __( 'map', 'map-block-leaflet' ),
        __( 'leaflet', 'map-block-leaflet' ),
    ],
    icon, 
    supports: {
		align: [ 'wide', 'full' ],
	},
    attributes,
    getEditWrapperProps({align}){
        if ( [  'wide', 'full' ].includes(align) ) {
            return { 'data-align': align };
        }
    },
    edit: props => {
        const { attributes, toggleSelection, setAttributes } = props;
        const {height} = attributes;
        
        const resetMap = () =>  {
            const { attributes,  setAttributes } = props;
            let  {zoom } = attributes;
            
            setAttributes({ zoom: zoom + 1})
            setTimeout( () => { 
                setAttributes( { zoom: props.attributes.zoom - 1 })
            },300)
        }
        return (
            <Fragment> 
                <Inspector {...props}/>
                <SearchPlace {...props} />

                <ResizableBox
                    size={ {
                        width: '100%',
                        height: height,
                    } }
                    minWidth= { '100%' }
                    maxWidth= { '100%' }
                    minHeight= { '100%' }
                    enable={ { top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
                    onResizeStart={ () => {
                        toggleSelection( false );
                    } }
                    onResizeStop={ ( event, direction, elt, delta ) => {
                        setAttributes( {
                            height: parseInt( height + delta.height, 10 ),
                        } );
                        resetMap();
                        toggleSelection( true );
                    } }
                >
                <LeafletMap {...props}/> 
			</ResizableBox>
            </Fragment>
        )
    },
    save: () => {
        return null;
    }
});
