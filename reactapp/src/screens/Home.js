  
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles  } from '@material-ui/core/styles';
import {connect} from 'react-redux';

// navigation
import { useHistory } from "react-router-dom";



// import icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';

// import css
import { Button } from '@material-ui/core';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

function Home(props) {
    const { classes } = props;
    const [email,setEmail] = useState('test');
    const [password,setPassword] = useState('test');


/*
        <Link to="/newpassword5f86cb003d835c1a2cc317fc" >   
        <Button variant="contained" color="primary">
            Lien
        </Button>
*/
let history = useHistory();
let byPassNavigation =()=>{
  let user ={
    email:false,
    pseudo:false
  }
  props.addInfoUser(user)

  history.push("/list");

}


  return (
    <div className={classes.body}>

      <Grid container className={classes.cardAll} spacing={2}   container
        direction="column"
        justify="center"
        alignItems="center">
          
        <Grid container className={classes.cardAll} spacing={2}   container
          direction="row"
          justify="center"
          alignItems="center">
            
        <Grid item xs={4} >
          <Card className={classes.cardAllContent}>
            <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
             Connexion
            </Typography>
              <div className={classes.imputFields}>           
                <TextField id="standard-basic" label="Email" onChange={(e)=> setEmail(e.target.value)} />
                <TextField id="standard-basic" label="Mot de passe" onChange={(e)=> setPassword(e.target.value)} />
              </div>
            </CardContent>
            
            <CardActions className={classes.imputFields}>
            <Button variant="contained" className={classes.button} endIcon={<LockOpenIcon />}>
              Se connecter
            </Button>
            <Button color="primary">Mot de Passe oublié</Button>

            </CardActions>
          </Card>

            <Grid container className={classes.bottomButton} spacing={2}   container
            direction="row"
            justify="center"
            alignItems="center">
              <Button variant="contained" className={classes.button}  endIcon={<PersonIcon />} onClick={()=>byPassNavigation()}>
                Créer un compte
              </Button>
              
              <Button variant="contained" className={classes.button}  endIcon={<SendIcon />}  onClick={()=>byPassNavigation()}>
                Utiliser sans Compte
              </Button>
            </Grid>
          </Grid>
        </Grid>
         
      </Grid>
    </div>
  );
}

const styles = {

    body:{
      backgroundColor:"#80d6ff",
      display:"flex",
      flex:1,
      height:"100vh",
      alignItem:"center",      
      
    },
    cardAll: {
      minWidth: 275,
    },
    cardAllContent:{
      borderRadius:"30px"
    },
    title: {
      fontSize: 30,
    },
    imputFields: {
      display:"flex",
      flex:1,
      flexDirection:"column"
    },
    button:{
      backgroundColor:"#0077c2",
      color:"white",
      margin:15,
      '&:hover': {
        backgroundColor:  "#42a5f5",
        borderColor: '#0062cc',
        boxShadow: 'none',
        color:"black"
      },
    },
    bottomButton:{
      marginTop:15,
    }
    };



    
    Home.propTypes = {
      classes: PropTypes.object.isRequired,
    };


    function mapDispatchToProps(dispatch) {
      return {
        addInfoUser: function(item) { 
          dispatch( {type: 'informationUser',item}) 
        },
        
      }
    }
    
    function mapStateToProps(state) {
      return { informationUser: state.informationUser }
    }
      
    export default connect(
      mapStateToProps, 
        mapDispatchToProps
    )( withStyles(styles)(Home));
    