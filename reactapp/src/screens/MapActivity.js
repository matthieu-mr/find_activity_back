  
import React, { useState,useEffect,PureComponent } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Map, Marker, Popup, TileLayer,MapContainer } from "react-leaflet";
import { Icon } from "leaflet";
import { FixedSizeList } from 'react-window';
import ListItem from '@material-ui/core/ListItem';



// import icon
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SendIcon from '@material-ui/icons/Send';
import '../App.css'
// import css
import { Button,Card,Typography,TextField,AppBar,Tabs,Tab,Box,withStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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




function MapActivity(props) {
    const { index, classes } = props;
    const [listAdressResult,setListAdressResult] = useState([])

    const [value, setValue] = React.useState(0);
    const [adressSearch,setAdressSearch] = useState("16 rue saint hilaire")
    const [listAdressParticipant,setListAdressParticipant]=useState([])
    const [listFavoriteAdress,setListFavoriteAdress]=useState([])
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(()=>{
      let id="5f86cb003d835c1a2cc317fc"
      async function recupDonnée(){
        var requestBDD = await fetch(`users/userinformation`,{
          method:"POST",
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body:`id=${id}`
        })
        var adressRaw = await requestBDD.json()
        setListFavoriteAdress(adressRaw.user.contactInt)
      }
      recupDonnée()
      
    },[])


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
            centered
          >
            <Tab label="Sports"  className={classes.tabStyle} />
            <Tab label="Sorties" className={classes.tabStyle}  />

        </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>

    </TabPanel>
    <TabPanel value={value} index={1}>

    </TabPanel>
    <TabPanel value={value} index={2}>
 
      </TabPanel>
    <TabPanel value={value} index={3}>
        Item 4
    </TabPanel>
    </div>  

    <div className={classes.buttonValidate} >  
      <Button variant="contained" color="secondary">
        Valider l'activité    <SendIcon  className={classes.iconSend}/>
      </Button>
    </div>

</Card>



  <MapContainer
    className={classes.mapContainer}
    center={[48.8534,2.3488]}
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
          index={i}
          id={i}
          name={item.name}
          postCode={item.postcode}
          adress={item.adress} 
          city={item.city}
          isFavorite= {item.isFavorite}
          lat={item.lat}
          lon={item.lon}
          type={"adress"}
        />
      )
    })}

{props.rdvPoint.map((item,i)=>{
      return (
        <CustomMarker 
          index={i}
          id={i}
          name={item.name}
          postCode={item.postcode}
          adress={item.adress} 
          city={item.city}
          isFavorite= {item.isFavorite}
          lat={item.lat}
          lon={item.lon}
          type={"rdvPoint"}
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
      display:"flex",
      alignItems:"center",
      '&$selected': {
        color: '#1890ff',
        backgroundColor: "red",

      },    '&:focus': {
        color: '#40a9ff',
      },
    },
    tabStyle:{
      width:"50%",
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
        display:"flex",
        width:"100%"
        },

    showListItem:{
      display:"flex",
      flexDirection:"column",
      width:"100%",
      padding:0
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



    
    MapActivity.propTypes = {
      index: PropTypes.number.isRequired,
      classes: PropTypes.object.isRequired,
    };

    function mapDispatchToProps(dispatch) {
        return {
          addInfoUser: function(info) { 
            dispatch( {type: 'informationUser'}) 
          },
          addRdvPoint: function(info) { 
            dispatch( {type: 'addRdvPointAdress',info:info}) 
          },
          
        }
      }
      
      function mapStateToProps(state) {
        return { informationUser: state.informationUser,listAdressParticipant:state.listAdressParticipant,rdvPoint:state.rdvPointAdress }
      }
        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(MapActivity));
          
