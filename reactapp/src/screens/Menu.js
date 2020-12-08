import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';

import {Divider, withStyles } from '@material-ui/core';
// navigation
import { useHistory } from "react-router-dom";



// import icon
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


var backgroundColorTest = "#0077c2"



function MenuApp(props) {

// boop Article = https://www.joshwcomeau.com/react/boop/?utm_campaign=sebastien_lorber_newsletter&utm_medium=email&utm_source=Revue%20newsletter

    const { index, classes } = props;
    const [isBooped, setIsBooped] = useState(false);
    backgroundColorTest="red"
    //console.log(isBooped)
    const [isShown, setIsShown] = useState(false);
    let history = useHistory();

    let navigation =(url)=>{
    
      history.push(`/${url}`);
    
    }



    let MenuNavigation = ()=>{
        if(isShown){
  
        return (
            <div className={classes.allLabel}>
               <p className={classes.wording}> <MenuIcon className={classes.iconStyle} /> Menu</p>
                <Divider className={classes.dividerClass} />
                <Button className={classes.buttonStyle}> <p className={classes.wording} onClick={()=>navigation("mapactivity")}> <HomeIcon className={classes.iconStyle} /> Trouver une activité </p></Button> 
                <Button className={classes.buttonStyle}> <p className={classes.wording} onClick={()=>navigation("contactlist")}> <PersonIcon className={classes.iconStyle}  /> Vos Contacts </p></Button> 
                <Button className={classes.buttonStyle}> <p className={classes.wording}> <RestaurantMenuIcon className={classes.iconStyle} /> Vos activités </p></Button> 
                
                <Divider className={classes.dividerClass}/>
                <Button className={classes.buttonStyle}><p className={classes.wording}> <ExitToAppIcon className={classes.iconStyle}  /> Déconnexion </p></Button> 
            </div>
        )
        }else{
            return (
            <div >
                <p className={classes.wording} variant='fullWidth'> <MenuIcon/> </p>
                <Divider className={classes.dividerClass} />
                <p className={classes.wording}> <HomeIcon /> </p>
                <p className={classes.wording}> <PersonIcon /> </p>
                <p className={classes.wording}> <RestaurantMenuIcon /> </p>
                <Divider className={classes.dividerClass}/>
                <p className={classes.wording}> <ExitToAppIcon /> </p>
            </div>
            )

        }
    }



  return (
    <div className={classes.body}        
            onMouseEnter={() =>{ setIsShown(true);setIsBooped(true)}}
            onMouseLeave={() =>{ setIsShown(false);setIsBooped(false)}}
            > 
        < MenuNavigation />
    </div>

  );
}


MenuApp.propTypes = {
    index: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
};


const styles = {
    body:{
      backgroundColor: backgroundColorTest,
      paddingLeft:"15px", 
      paddingRight:"15px", 
      width:50,
      height:"100vh" ,
        '&:hover': {
        borderColor: '#0062cc',
        boxShadow: 'none',
        color:"black",
        width:"20%",
        transform: { rotate: "45deg" }
      
      },
    },

    allLabel:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center"
    },
    buttonStyle:{
        display:"flex",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        alignItems:"flex-start",
    },
    wording:{
        display:"flex",
        color:"white",
        magrinLeft:15,
        alignItems:"center",
     paddingRight:"15px"
    },
    iconStyle:{
        marginRight:"15px",
        '&:hover': {
          color:"red",
      
         transform: {rotate:"45deg",}
        },
    },
    dividerClass:{
        backgroundColor:"#80d6ff",
    },
};



    
    MenuApp.propTypes = {
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
      )( withStyles(styles)(MenuApp));
          
