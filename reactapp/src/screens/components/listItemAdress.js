  
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

// import css


function ListItemAdress(props) {
    const { classes } = props;

let addAdress=()=>{
    props.addParticipantList(props)

}


/*old
<div className={classes.containerList} > 
    <Button onClick={()=>addAdress()} className={classes.button}> 
            <List className={classes.listItem}>
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary={props.title1}
                    secondary={props.title2}
                  />
                      <AddCircleOutlineIcon style={{ color:"#42a5f5"}} />
                </ListItem>
                <Divider />
            </List>
    </Button>

</div>


*/

  return (

<div className={classes.containerList} > 
    <Button onClick={()=>addAdress()} className={classes.button}> 
            <List className={classes.listItem}>
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary={props.title1}
                    secondary={props.title2}
                  />
                      <AddCircleOutlineIcon style={{ color:"#42a5f5"}} />
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
            addParticipantList: function(info) {
                dispatch( {type: 'addNewParticipantAdress',info:info} )
                },
        }
      }
      

        
    export default connect(
        mapStateToProps, 
          mapDispatchToProps
      )( withStyles(styles)(ListItemAdress));
          
