var React = require('react')
var ReactDOM = require('react-dom')
var StaticMap = require ('./google-static-map.jsx')
var $ = require('jquery')

require('../styles/location-display-style.scss')

module.exports =  React.createClass({
  getInitialState: function(){
    return {
      width: 0,
      height: 0,
    }
  },

  render: function (){

    var white = "0xFFFFFF"
    var black = "0x222222"
    var whiteShade = "0xF4F4F4"

    var mapProps = {}
    mapProps.latitude = this.props.latitude
    mapProps.longitude = this.props.longitude
    mapProps.zoom = 16
    mapProps.width = 640
    mapProps.height = 640
    mapProps.scale = 2
    mapProps.markers = {
      locations: [ 
        this.props.latitude + ',' + this.props.longitude, 
      ]
    }
    mapProps.styles = [
      // hidden items
      {
        feature: "poi",
        rules: {
          visibility: "off",
        }
      },
      {
        element: "labels.icon",
        rules: {
          visibility: "off",
        }
      },
      // general landscape
      {
        feature: "landscape",  
        element: "geometry",
        rules: {
          color: white,
          visibility: "simplified",
        }
      },
      // roads
      {
        feature: "road",
        element: "geometry.fill",
        rules: {
          color: black,
        }
      },
      {
        feature: "road",
        element: "geometry.stroke",
        rules: {
          visibility: "off"
        }
      },
      {
        feature: "road",
        element: "labels.text.fill",
        rules: {
          color: white,
        }
      },
      {
        feature: "road",
        element: "labels.text.stroke",
        rules: {
          color: black,
        }
      },
    ]

    mapProps.APIKey = 'AIzaSyAAZvR0LhIx6x6LWF3tt4oNSG2SEv40zFU'

    mapProps.className = 'map'

    var mapLink = "https://www.google.com/maps/dir/Current+Location/" + this.props.latitude + ',' + this.props.longitude

    return (
      <div className="location-display">
        <a className="coordinate-display"  href={ mapLink }>
          <div>
            <div className="coordinate" id="latitude">
              <div>
                <h3>{this.props.latitude}</h3>
              </div>
            </div>
            <div className="coordinate" id="longitude">
              <div>
                <h3>{this.props.longitude}</h3>
              </div>
            </div>
            <div className="right-arrow">
              <svg>
                <polygon className="black" points="1,54.008 36.991,36 18.995,62.996 36.991,72 109,36 36.99,0 18.987,9 36.991,36 1,18.008 0,18.008 0,54.008  "/>
                <polygon className="white" points="1,18.01 36.991,36.002 1,54.01 18.995,62.998 72.995,36.002 18.987,9.002  "/>
              </svg>
            </div>
            <div className="bottom-arrow">
              <svg>
                <polygon className="black" points="17.992,1 36,36.991 9.004,18.995 0,36.991 36,109 72,36.99 63,18.987 36,36.991 53.992,1 53.992,0 17.992,0  "/>
                <polygon className="white" points="53.99,1 35.998,36.991 17.99,1 9.002,18.995 35.998,72.995 62.998,18.987  "/>
              </svg>
            </div>
          </div>
        </a>
        <StaticMap {...mapProps}/>
      </div>
    )
  }
})