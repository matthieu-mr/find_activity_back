  
import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles  } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import { Map, Marker, Popup, TileLayer,MapContainer } from "react-leaflet";
import { Icon } from "leaflet";
import { FixedSizeList } from 'react-window';
import ListItem from '@material-ui/core/ListItem';

// import css
// import icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import '../App.css'
// import css
import { Button } from '@material-ui/core';
//import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {Column, Table,List} from 'react-virtualized';


// import component
import ListItemComponent from './components/listItemAdress'


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  




function MapUser(props) {
    const { index, classes } = props;
    const [listAdressResult,setListAdressResult] = useState([])

    const [value, setValue] = React.useState(0);
    const [adressSearch,setAdressSearch] = useState("16 rue saint hilaire")

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(()=>{
        async function recupDonnée(){
            var requestBDD = await fetch('adress/coords', {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `adress=${adressSearch}`
              });
              var listAdressBdd = await requestBDD.json()
              setListAdressResult(listAdressBdd)
        }
        recupDonnée()

    },[adressSearch])     

    let ListResultSearchAdress = listAdressResult.map((item,i)=>{
        let cityWording =`${item.properties.postcode} - ${item.properties.city} `
        
        return (
            <ListItemComponent key={i} title1={item.properties.name} title2={cityWording} postcode={item.properties.postcode} city={item.properties.city} type="adress" action="addParticipant" screenShow="addParticipantAdress" lat={item.geometry.coordinates[1]} lon={item.geometry.coordinates[0]} />
        )
    
      })

      
  return (
<div className={classes.body}> 

<Card className={classes.cardAllContent}>
  <div className={classes.appbarContainer}>
  <AppBar position="static">
        <Tabs value={value} onChange={handleChange}          
         indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
            <Tab label="Liste des participants"  />
            <Tab label="Vos Adresses"  />
            <Tab label="Votre position"/>
        </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>
    <TextField id="standard-basic" label="Rechercher une adresse" onChange={(e)=> setAdressSearch(e.target.value)} />    
 
    <List component="nav" className={classes.root} aria-label="contacts">
    <ListItem className={classes.listItem}>
    <rowRenderer/>



  </ListItem>
  </List>
    </TabPanel>
    <TabPanel value={value} index={1}>
        Item Two
    </TabPanel>
    <TabPanel value={value} index={2}>
        Item Three
    </TabPanel>

  </div>


  <Button variant="contained" color="secondary">
  Secondary
  </Button>
</Card>


<MapContainer
  className={classes.mapContainer}
  center={[51.0, 19.0]}
  zoom={4}
  maxZoom={18}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  />

</MapContainer>
</div>

     
  );
}

const styles = {

    body:{
      backgroundColor:"#80d6ff",
      display:"flex",
      flex:1,  
      
    },


    listItem:{
      overflowY: "scroll",
           flex:1,
      flexDirection:"column"
    },
    cardAllContent:{
        backgroundColor:"white",
        width:'35%',
        maxHeight:"100vh"
    },
    mapcontainer:{
        backgroundColor:"white",
        width:'80%',
        zIndex:1,
        position: "absolute",
        marginLeft:50,
        marginTop:30,
        maxHeigth:"10%"
    }
    };



    
    MapUser.propTypes = {
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
      )( withStyles(styles)(MapUser));
          
