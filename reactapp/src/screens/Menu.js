import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import {Divider, withStyles } from '@material-ui/core';


// import icon
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


function MenuApp(props) {
    const { index, classes } = props;

    const [isShown, setIsShown] = useState(false);

    let MenuNavigation = ()=>{

        if(isShown){
        return (
            <div className={classes.allLabel}>
               <p className={classes.wording}> <MenuIcon className={classes.iconStyle} /> Menu</p>
                <Divider className={classes.dividerClass} />
                <Button className={classes.buttonStyle}> <p className={classes.wording}> <HomeIcon className={classes.iconStyle} /> Trouver une activité </p></Button> 
                <Button className={classes.buttonStyle}> <p className={classes.wording}> <PersonIcon className={classes.iconStyle}  /> Vos Contacts </p></Button> 
                <Button className={classes.buttonStyle}> <p className={classes.wording}> <RestaurantMenuIcon className={classes.iconStyle} /> Vos adresses </p></Button> 
                
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
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
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
      backgroundColor: "#0077c2",
      paddingLeft:"15px", 
      paddingRight:"15px", 
      width:50, 
      '&:hover': {
        borderColor: '#0062cc',
        boxShadow: 'none',
        color:"black",
        width:"20%"
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
        marginRight:"15px"
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
          
