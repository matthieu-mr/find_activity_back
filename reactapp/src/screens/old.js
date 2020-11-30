  
import React, { useState,useEffect,PureComponent,Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Map, Marker, Popup, TileLayer,MapContainer } from "react-leaflet";
import { Icon } from "leaflet";
import { FixedSizeList } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
// import css
import GoogleMapReact from 'google-map-react';



// import icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import '../App.css'
// import css
import { Button,Card,Typography,TextField,AppBar,Tabs,Tab,Box,withStyles } from '@material-ui/core';
//import {Link} from 'react-router-dom';

// import component 
import MenuApp from './Menu'

// import component
import ListItemComponent from './components/listItemAdress'
import CustomMarker from './components/markerMap'


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
    const [listAdressParticipant,setListAdressParticipant]=useState([])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  
console.log("list adresse participant",listAdressParticipant)

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

    useEffect(()=>{
      setListAdressParticipant(props.listAdressParticipant)
  },[props.listAdressParticipant]) 



  return (
<div className={classes.body}> 
  <MenuApp />

<Card className={classes.cardAllContent} >

    <div >
    <AppBar position="static">
        <Tabs 
            value={value} 
            onChange={handleChange}          
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            className={classes.tabHeader}
          >

            <Tab label="Participants"  />
            <Tab label="Vos Contacts"  />
            <Tab label="Ajout Adresse"/>
            <Tab label="Votre position"/>
        </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>
    <TextField id="standard-basic" className={classes.inputStyle} label="Rechercher une adresse" onChange={(e)=> setAdressSearch(e.target.value)} />    

            <div className={classes.showList}> 
                <ul>
                    { listAdressResult.map((item,i)=>{
                    let cityWording =`${item.properties.postcode} - ${item.properties.city} `
                    
                    return (
                        <ListItemComponent key={i} title1={item.properties.name} title2={cityWording} postcode={item.properties.postcode} city={item.properties.city} type="adress" action="addParticipant" screenShow="addParticipantAdress" lat={item.geometry.coordinates[1]} lon={item.geometry.coordinates[0]} />
                    )
                
                })}
                </ul>
            </div>
    </TabPanel>
    <TabPanel value={value} index={1}>
        Item Two
    </TabPanel>
    <TabPanel value={value} index={2}>
        Item Three
    </TabPanel>
    <TabPanel value={value} index={3}>
        Item 4
    </TabPanel>
    </div>  

    <div className={classes.buttonValidate} >  
      <Button variant="contained" color="secondary">
        Valider participants    <SendIcon  className={classes.iconSend}/>
      </Button>
    </div>

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

      {listAdressParticipant.map((item,i)=>{
      return (
        <CustomMarker 
          id={i}
          name={item.name}
          postCode={item.postcode}
          adress={item.adress} 
          city={item.city}
          isFavorite= {item.isFavorite}
          lat={item.lat}
          lon={item.lon}
        />
      )
    })}
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

    inputStyle:{
      width:"100%"
    },
    tabHeader:{
      backgroundColor: "#0077c2",
      '&$selected': {
        color: '#1890ff',
        backgroundColor: "red",

      },    '&:focus': {
        color: '#40a9ff',
      },
    },
    cardAllContent:{
        display:"flex",
        flexDirection:"column",
        width:'35%',
        maxHeight:"100vh",
        justifyContent:"space-between",
        alignItems:"stretch"
    },
    showList:{
        maxHeight:"77vh",
        overflowY: "auto",
        },

    buttonValidate:{
      display:"flex",
      justifyContent:"center",
      width:'100%',
      marginBottom:"15px",
    },
    mapcontainer:{
        backgroundColor:"white",
        width:'100%',
        zIndex:1,
        position: "absolute",
        marginLeft:50,
        marginTop:30,
        maxHeigth:"10%"
    },
    iconSend:{
      marginLeft:15
    },

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
        return { informationUser: state.informationUser,listAdressParticipant:state.listAdressParticipant }
      }
        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(test));
          
