import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { useForm } from "react-hook-form";

import { withStyles,Divider,Card,CardContent,Button, Typography,Grid,TextField} from '@material-ui/core';
// navigation
import MenuApp from './Menu'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
var backgroundColorTest = "#0077c2"


function ModifInformation(props) {
    const { index, classes } = props;

   
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log("recup infotation",data);
    const [showSearchAdress,setShowSearchAdress]=useState(false)
    const [searchAdress,setSearchAdress]=useState('')



    console.log(searchAdress)

    let formatAdress = `${props.information.postcode}, ${props.information.city}`
    

    let Validate =()=>{
        console.log("validate")
    }

    let Cancel =()=>{
        console.log("Cancel")
    }


    let CardResultAdress =()=>{
        if(showSearchAdress){
            return (
                <Card >
    
                <CardContent>
                    <p> hello</p>
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
        <TextField id="standard-basic" label={props.information.name}  name="name" inputRef={register} className={classes.inputName}/>
     
         <Divider className={classes.dividerClass}/>

         <TextField id="standard-basic" label={formatAdress}  name="adressname2" inputRef={register} className={classes.inputName} />
         <TextField id="standard-basic" label={formatAdress}  name="adressname2" inputRef={register} className={classes.inputName} />

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

    <CardResultAdress/>

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
      oneCard:{
        borderRadius:15,
        alignSelf:"center",
        marginTop:"20px",
        width:"50%",
      },
      inputName:{
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
          
