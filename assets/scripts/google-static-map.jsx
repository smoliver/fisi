var React = require('react')
var SvgAttributes = require('./svg-attributes.jsx')

module.exports = React.createClass({
	propTypes: {
		latitude: React.PropTypes.number.isRequired,
		longitude: React.PropTypes.number.isRequired,
		zoom: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		scale: React.PropTypes.oneOf([1, 2, 4]),
		styles: React.PropTypes.array,
		APIKey: React.PropTypes.string.isRequired,
	},

	render: function(){
		var and = "&"
		var bar = "%7C"

		var URL

		// add required components definitions to the url
		var baseURL = "https://maps.googleapis.com/maps/api/staticmap?"
		var centerURL  = "center=" + this.props.latitude + "," + this.props.longitude
		var zoomURL = "zoom=" + this.props.zoom
		var sizeURL = "size=" + this.props.width + "x" + this.props.height

		URL = baseURL + and + centerURL + and + zoomURL + and + sizeURL

		// add optional elements to the url
		if (this.props.scale != undefined){
			var scaleURL = "scale=" + this.props.scale
			URL += and + scaleURL
		}

		if (this.props.markers != undefined){
			var markersURL =  "markers="
			var markers = this.props.markers
			if (markers.style){
				markersURL += markers.style + bar
			}
			for (var i = 0; i < markers.locations.length; ++i){
				if (i > 0){
					markersURL += bar + markers.locations[i]
				}
				else {
					markersURL += markers.locations[i]
				}
			}
			URL += and + markersURL
		}

		//add all of the style elements to the url
		if(this.props.styles != undefined){
			for (var i = 0; i < this.props.styles.length; ++i){
				var singleStyle = this.props.styles[i]
				var styleURL = "style="
				// console.log("styles=")
				if(singleStyle.feature != undefined){
					styleURL += "feature:" + singleStyle.feature
					// console.log("feature:" + singleStyle.feature)
					
				}
				if(singleStyle.element != undefined){
					if(singleStyle.feature != undefined){
						//add a seporator if the feature was defined
						styleURL += bar
					}
					styleURL += "element:" + singleStyle.element
					// console.log( "element:" + singleStyle.element )
				}
				
				var keys = Object.keys(singleStyle.rules)
				for (var j = 0; j < keys.length; ++j){
					styleURL += bar + keys[j] + ":" +singleStyle.rules[keys[j]]
					// console.log( keys[j] + ":" +singleStyle.rules[keys[j]] )
				}
				URL += and + styleURL;
			}
		}

		// add the api key to the url
		var keyURL = 'key=' + this.props.APIKey
		URL += and + keyURL

		var mapStyle = {
			backgroundImage: 'url(' + URL + ')',
		}

		return (
			<div className={ this.props.className } style={ mapStyle }/>
		)
	}
})


