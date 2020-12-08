  
import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles  } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
// import css


function ListItemAdress(props) {
    const { classes } = props;

   // let colorAddButton = "#42a5f5"
    let colorAddButton = "red"
    let iconIsFavorite


    switch (props.isFavorite) {
      case false:
        colorAddButton = "green"
        iconIsFavorite = <StarBorderIcon  style={{ color:colorAddButton,marginRight:15}}/>

        break;
        case true:
          colorAddButton = "#42a5f5"
          iconIsFavorite = <StarIcon  style={{ color:colorAddButton,marginRight:15}}/>

        break;
      default:
        colorAddButton = "red"
    }



let addNewAdressToListParticipant=()=>{
  switch (props.action) {
    case 'addFavoriteParticipant':
      console.log("recup bouton add",props)
      props.addFavParticipantList(props)
      break;

      case 'addNewParticipant':
        props.addNewParticipantList(props)
        break;  
    default:
      console.log("aucune action sur bouton")
  }
}

  return (

<div className={classes.containerList} > 
    <Button onClick={()=>addNewAdressToListParticipant()} className={classes.button}> 
            <List className={classes.listItem}>
 
                <ListItem className={classes.listItem}>
                {iconIsFavorite}

                  <ListItemText
                    primary={props.title1}
                    secondary={props.title2}
                  />
                  <AddCircleOutlineIcon style={{ color:colorAddButton}} />
                </ListItem>
                <Divider />
            </List>
    </Button>

</div>

  );                                                                                                     
}

const styles = {

    containerList:{
        display:"flex",
        flex:1,  
    },
    button:{
        flex:1, 
    },
    listItem:{
        display:"flex",
        flex:1, 
        marginLeft:5
    },
    };



    
    ListItemAdress.propTypes = {
      classes: PropTypes.object.isRequired,
    };

    function mapStateToProps(state) {
        return { informationUser: state.informationUser }
      }

    function mapDispatchToProps(dispatch) {
        return {
            addNewParticipantList: function(info) {
                dispatch( {type: 'addNewParticipantAdress',info:info} )
                },
            addFavParticipantList: function(info) {
              dispatch( {type: 'addFavParticipantAdress',info:info} )
              },
        }
      }
      

        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(ListItemAdress));
          
