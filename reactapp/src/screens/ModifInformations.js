import React, { useState,useEffect } from 'react';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import { withStyles,Divider,Card,CardContent,Button, Typography,Grid,TextField} from '@material-ui/core';
import Grow from '@material-ui/core/Grow';


// navigation
import MenuApp from './Menu'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
// import component
import ListItemComponent from './components/listItemAdress'




function ModifInformation(props) {
    const { index, classes } = props;

    // if show result of search adress
    const [showSearchAdress,setShowSearchAdress]=useState(false)

    // search & get result
    const [adressSearch,setAdressSearch]=useState('')
    const [listAdressResult,setListAdressResult]= useState([])


    const [animation,setAnimation]=useState(true)




    const [infoAdressForm,setInfoAdressForm]=useState({
        id:props.information._id,
        name : props.information.name,
        adress:props.information.adress,
        type:props.information.type,
        postcode:props.information.postcode,
        city:props.information.city,
        lat:props.information.lat, 
        lon:props.information.lon,
        isFavorite:"String",
    })

    let Validate = async ()=>{
        await fetch(`users/modifinfo`,{
            method:"POST",
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body:`info=${infoAdressForm}&type=${infoAdressForm.type}&email=${props.userInfo.email}`
          })
    }

    let Cancel =()=>{
        console.log("hello")
        setAnimation(!animation)
    }

    /// search adress 
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
    
    // validating the choice of the new addres 
    let getTheNewAdress =(item)=>{
        setInfoAdressForm(prevState=>({
            ...prevState,
            adress:item.properties.name,
            postcode:item.properties.postcode,
            city:item.properties.city,
            lat:item.geometry.coordinates[0], 
            lon:item.geometry.coordinates[1],
        }))

     setShowSearchAdress(!showSearchAdress)
    }


    let CardResultAdress =()=>{
        if(showSearchAdress){
            return (
            <Card >
                <CardContent>
                { listAdressResult.map((item,i)=>{                   
                    return (
                        <span  onClick={()=>{getTheNewAdress(item)}} >
                        <ListItemComponent key={i} 
                            title1={item.properties.name} 
                            title2={`${item.properties.postcode} - ${item.properties.city} `} 
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
        return( <div></div>)
    }


  return (
    <div className={classes.body}> 
    <MenuApp />
        <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
            >
        <Typography className={classes.title} variant="h1" component="h1"  id="name-contact"  >
            Modification du contact : {props.information.name}
        </Typography>




        <Card className={classes.cardAllContent}>

            <CardContent>

                <TextField id="standard-basic" 
                    label={infoAdressForm.name}  
                    name="adressname2" 
                    className={classes.inputStyle}
                    onChange={(e)=>{ setInfoAdressForm(prevState=>({
                        ...prevState,
                        name:e.target.value,
                    }))}}
                />
        
                <Divider className={classes.dividerClass}/>
                <TextField label={`${infoAdressForm.adress}`}  name="adressname3" className={classes.inputStyle} 
                    onClick={()=>{setShowSearchAdress(!showSearchAdress)}}
                    onChange={(e)=>{setAdressSearch(e.target.value)}}
                    value={adressSearch}
                />

            </CardContent>

        <CardResultAdress />


        <Divider className={classes.dividerClass}/>
        
        <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="flex-end"
            className={classes.buttonGroup}
            >

            <Button size="medium" 
            variant="contained" 
            color="secondary" 
            id="modif-contact" 
            >

            <Grow in={true}
                     style={{ transformOrigin: '10 0 0' }}
                     {...(animation ? { timeout: 1500 } : {})}>
                <Typography className={classes.buttonWording} >

                < EditIcon style={{marginRight:5}}/> 
                Modifier
                </Typography>
            </Grow>             
            </Button>

            <Button size="medium"  variant="contained" color="error" id="delete-contact"  
            className={classes.buttonAlert} 
            onClick={()=>Cancel()}
            >
            
                <Grow in={true}
                        
                        {...(animation ? { timeout: 1500,color:"green" } : {})}>
                    <Typography className={classes.buttonWording} >
                        <DeleteForeverIcon style={{marginRight:5}} /> Supprimer
                    </Typography>
                </Grow>

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
      title:{
        display:"flex",
        alignItems:"center",
        margin:15, 
        alignSelf:"center"
      },
    
      cardAllContent:{
        borderRadius:15,
        alignSelf:"center",
        marginTop:"20px",
        width:"50%",
        height:"40vh",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between"
    },
      inputStyle:{
        width:"100%",
        marginTop:30,
      },
      buttonGroup:{
        marginTop:15,
        marginBottom:15,
      },
      buttonAlert:{
          backgroundColor:"#d32f2f",
          color:"white",
          '&:hover': {
            backgroundColor:"#9a0007",
           transform: {rotate:"45deg",}
          },
      },

      buttonWording:{
        display:"flex",
        marginTop:5,
        marginBottom:5,
      }
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
          
