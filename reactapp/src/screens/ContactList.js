  
import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { useHistory } from "react-router-dom";

// import css
import { withStyles,Divider,Card,CardContent,Button, Typography,Grid} from '@material-ui/core';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
// import component 
import MenuApp from './Menu'



function ContactList(props) {
  const { index, classes } = props;
  const [listFavoriteAdress,setListFavoriteAdress]=useState([])
  let history = useHistory();
  console.log(props)

  //let id=props.id
  let id="5f86cb003d835c1a2cc317fc"


  let editAdress=(item)=>{
    props.sendToModif(item)
    console.log(item)
    history.push(`/modification-informations`);
  }

  let deleteAdress=(objectId)=>{
    let id="5f86cb003d835c1a2cc317fc"
    let type="contact"
    console.log("delete",id,type,objectId)
  }

  useEffect(()=>{
 
    async function recupDonnée(){
      var requestBDD = await fetch(`users/userinformation`,{
        method:"POST",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body:`id=${id}`
      })
      var adressRaw = await requestBDD.json()
      console.table(adressRaw.user.contactInt)
      setListFavoriteAdress(adressRaw.user.contactInt)
    }
    recupDonnée()
    
  },[])


return (
  <div className={classes.body}> 
  <MenuApp />
  <Grid
  container
  direction="column"
  justify="flex-start"
  alignItems="stetch"
        >

    <Typography  variant="h1" component="h1"  id="name-contact" className={classes.title}>
      Vos Contacts
    </Typography>

 
    { listFavoriteAdress.map((item,i)=>{
      return (
    <Card className={classes.oneCard}>

          <CardContent>
            <Typography  variant="h2" component="h2"  id="name-contact">
              {item.name}
              <Divider className={classes.dividerClass}/>

            </Typography>
            <Typography variant="h3" component="h3" className={classes.adress}>
                {item.adress}
            </Typography>
            <Typography variant="h3" component="h3" className={classes.adress}>            
                {item.postcode}, {item.city}
            </Typography>
          </CardContent>
        
        <Divider className={classes.dividerClass}/>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            className={classes.buttonGroup}
          >
            <Button size="small" variant="contained" color="secondary" id="modif-contact" onClick={()=>editAdress(item)}>
            < EditIcon />
              Modifier
            </Button>
            <Button size="small"  variant="contained" color="error" id="delete-contact"  className={classes.buttonAlert} onClick={()=>deleteAdress(item._id)}>
              <DeleteForeverIcon />
              Supprimer
            </Button>
          </Grid>
      </Card>
      )
    })}


</Grid>


</div>

     
  );
}
const styles = {
  body:{
    backgroundColor:"#80d6ff",
    display:"flex",
    flex:1, 
    
  },
  title:{
    display:"flex",
    alignItems:"center",
    marginTop:15, 
    alignSelf:"center"
  },

  oneCard:{
    borderRadius:15,
    alignSelf:"center",
    marginTop:"20px",
    width:"50%",
  },
  adress:{
    marginTop:15
  },
  buttonGroup:{
    padding:15,
  },
  buttonAlert:{
    color:"white",
    backgroundColor:'#c62828',
    '&:hover': {
      backgroundColor:  "#8e0000",
    },
  },
    };

    
    ContactList.propTypes = {
        index: PropTypes.number.isRequired,
        classes: PropTypes.object.isRequired,
    };

    function mapDispatchToProps(dispatch) {
        return {
          sendToModif: function(info) { 
            dispatch( {type: 'modifContact',info}) 
          },
        }
      }
      
      function mapStateToProps(state) {
        return { informationUser: state.informationUser }
      }
        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(ContactList));
          
