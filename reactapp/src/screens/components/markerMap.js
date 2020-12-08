  
import React, { useState,useEffect,PureComponent } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Map, Marker, Popup, TileLayer,MapContainer } from "react-leaflet";
import { Icon } from "leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';



// import icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import RoomIcon from '@material-ui/icons/Room';
// import css
import { Button,Card,Typography,TextField,AppBar,Tabs,Tab,Box,withStyles } from '@material-ui/core';



function MarkerMap(props) {
const { index, classes } = props;
const position = [props.lon,props.lat]
let wordingCity=`${props.postCode},  ${props.city}`

let colorMarker="green"

switch (props.type) {
  case 'rdvPoint':
    colorMarker="red"
    break;

  default:
    //console.log(`Sorry, we are out of .`);
}


const iconMarkup = renderToStaticMarkup(<RoomIcon style={{color:colorMarker}} />);

const customMarkerIcon = divIcon({
  html: iconMarkup,
});


return (
  <Marker 
    position={position} 
    icon={customMarkerIcon}
    eventHandlers={{
      click: () => {
        console.log('marker clicked')
      },
    }}
  >
      <Popup className={classes.markerStyle}>
        {props.adress}
        {wordingCity}


        <div className={classes.buttonValidate} >  
        <Button variant="contained" color="secondary"  onClick={() => {
          console.log("clic marker");}}>
        Voir <SendIcon  className={classes.iconSend}/>
        </Button>
        </div>
      </Popup>
    </Marker>
     
  );
}
const styles = {
    iconSend:{
      backgroundColor:"red"

    },
    
    };

    
    MarkerMap.propTypes = {
        index: PropTypes.number.isRequired,
        classes: PropTypes.object.isRequired,
    };

    function mapDispatchToProps(dispatch) {
        return {
          addInfoUser: function(info) { 
            dispatch( {type: 'informationUser'}) 
          },
        }
      }
      
      function mapStateToProps(state) {
        return { informationUser: state.informationUser }
      }
        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(MarkerMap));
          
