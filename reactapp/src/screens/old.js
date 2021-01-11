import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import { withStyles,Divider,Card,CardContent,Button, Typography,Grid,TextField} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';


// navigation
import MenuApp from './Menu'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
// import component
import ListItemComponent from './components/listItemAdress'
var backgroundColorTest = "#0077c2"


function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  


function ModifInformation(props) {
    const { index, classes } = props;
    const [showSearchAdress,setShowSearchAdress]=useState(false)
    const [adressSearch,setAdressSearch]=useState('')
    const [listAdressResult,setListAdressResult]= useState([])


    // modal paremeter
    const [open, setOpen] = React.useState(false);
    const [modalStyle] = React.useState(getModalStyle);


    const [labelName,setLabelName]=useState("")
    const [labelAdress,setLabelAdress]=useState("")
    const [selectedAdress,setSelectedAdress]=useState(true)

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };


    let Validate =()=>{
        console.log("validate")
    }

    let Cancel =()=>{
        setOpen(true);
    }


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
    

    let getTheAdress =(wording)=>{
        setLabelAdress(wording)
        setShowSearchAdress(!showSearchAdress)
    }


    let CardResultAdress =()=>{
        if(showSearchAdress){
            return (
            <Card >
                <CardContent>
                    
                <TextField label={props.information.adress}  name="adressname3" className={classes.inputName} 
                onChange={(e)=>{setAdressSearch(e.target.value)}}
            />

                { listAdressResult.map((item,i)=>{
                    let cityWording =`${item.properties.postcode} - ${item.properties.city} `
                    
                    return (
                        <span  onClick={()=>{getTheAdress(cityWording)}} >
                        <ListItemComponent key={i} 
                            title1={item.properties.name} 
                            title2={cityWording} 
                            postcode={item.properties.postcode} 
                            city={item.properties.city} 
                            type="adress" 
                            action="addNewParticipant" 
                            screenShow="addParticipantAdress" 
                            isFavorite={false} 
                            lat={item.geometry.coordinates[0]} 
                            lon={item.geometry.coordinates[1]} 
                        />
                        </span>
                    )
                
                })}
                </CardContent>
            </Card>
            )
        }
        return(            
        <Button size="small"  variant="contained" color="error" id="delete-contact"  className={classes.buttonAlert} onClick={()=>setShowSearchAdress(!showSearchAdress)}>
        <DeleteForeverIcon />
        Supprimer
    </Button>)
    }

/*
            <TextField label={props.information.adress}  name="adressname3" className={classes.inputName} 
        onClick={()=>{setShowSearchAdress(!showSearchAdress)}}
        onChange={(e)=>{setAdressSearch(e.target.value)}}
            />
*/

  return (
    <div className={classes.body}> 
    <MenuApp />
        <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stetch"
            >

        <Card className={classes.oneCard}>

        <CardContent>
        <TextField id="standard-basic" label={props.information.name}  name="adressname2" className={classes.inputName}/>
     
            <Divider className={classes.dividerClass}/>
            <CardResultAdress/>

        </CardContent>

        <Divider className={classes.dividerClass}/>
        
        <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        className={classes.buttonGroup}
        >
            <Button size="small" variant="contained" color="secondary" id="modif-contact" >
            < EditIcon />
                Modifier
            </Button>
            <Button size="small"  variant="contained" color="error" id="delete-contact"  className={classes.buttonAlert} onClick={()=>Cancel()}>
                <DeleteForeverIcon />
                Supprimer
            </Button>
        </Grid>
    </Card>

    </Grid>
      
  

        </div>

  );
}


ModifInformation.propTypes = {
    index: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
};


const styles = {
    body:{
        backgroundColor:"#80d6ff",
        display:"flex",
        flex:1,
      },
      modal: {
        position: 'absolute',
        width: "90%",
        marginleft:"5%",
        border: '2px solid #000',
        padding: 2,
        height:"40vh",
        marginTop:50
      },
};


    function mapDispatchToProps(dispatch) {
        return {
          addInfoUser: function(info) { 
            dispatch( {type: 'informationUser'}) 
          },
          
        }
      }
      
      function mapStateToProps(state) {
        return { information: state.ModifInformation }
      }
        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(ModifInformation));
          
