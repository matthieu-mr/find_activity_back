import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { useForm } from "react-hook-form";

import { withStyles,Divider,Card,CardContent,Button, Typography,Grid,TextField} from '@material-ui/core';
// navigation
import MenuApp from './Menu'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
// import component
import ListItemComponent from './components/listItemAdress'
var backgroundColorTest = "#0077c2"


function ModifInformation(props) {
    const { index, classes } = props;
   
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log("recup data",data);
    const [showSearchAdress,setShowSearchAdress]=useState(false)
    const [adressSearch,setAdressSearch]=useState('')
    const [listAdressResult,setListAdressResult]= useState([])


    const [labelName,setLabelName]=useState("name")
    const [labelAdress,setLabelAdress]=useState("adress")


    let Validate =()=>{
        console.log("validate")
    }

    let Cancel =()=>{
        console.log("Cancel")
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
        return(<p></p>)
    }


  return (
    <div className={classes.body}> 
    <MenuApp />
        <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stetch"
            >

<form onSubmit={handleSubmit(onSubmit)}>


        <Card className={classes.oneCard}>

        <CardContent>
        <TextField id="standard-basic" label={labelName}  name="adressname2" inputRef={register} className={classes.inputName}/>
     
            <Divider className={classes.dividerClass}/>

            <TextField id="standard-basic" label={labelAdress}  name="adressname3" inputRef={register} className={classes.inputName}
            onClick={()=>{setShowSearchAdress(!showSearchAdress)}}
            onChange={(e)=>{setAdressSearch(e.target.value)}}
            />

        </CardContent>

        <Divider className={classes.dividerClass}/>
        
        <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        className={classes.buttonGroup}
        >
            <Button size="small" variant="contained" color="secondary" id="modif-contact" type="submit">
            < EditIcon />
                Modifier
            </Button>
            <Button size="small"  variant="contained" color="error" id="delete-contact"  className={classes.buttonAlert} onClick={()=>Cancel()}>
                <DeleteForeverIcon />
                Supprimer
            </Button>
        </Grid>
    </Card>
    </form>

    <CardResultAdress />

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
          
