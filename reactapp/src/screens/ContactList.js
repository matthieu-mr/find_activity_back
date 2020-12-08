  
import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// import css
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import component 
import MenuApp from './Menu'


function ContactList(props) {
  const { index, classes } = props;
  const [listFavoriteAdress,setListFavoriteAdress]=useState([])

  useEffect(()=>{
    let id="5f86cb003d835c1a2cc317fc"
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


  <div className={classes.allCardsBody}>
  { listFavoriteAdress.map((item,i)=>{
    return (
  <Card className={classes.oneCard}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {item.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="secondary">
          Modifier
        </Button>
        <Button size="small" color="secondary">
          Learn More
        </Button>
      </CardActions>
    </Card>
    )
  })}
  </div> 



</div>

     
  );
}
const styles = {
  body:{
    backgroundColor:"#80d6ff",
    display:"flex",
    flex:1, 
    
  },

  allCardsBody:{
    display:"flex",
    flexDirection:"column",
    flex:2, 
    alignSelf:"flex-start",
    justifyContent:"center",
    marginTop:15,
  },
  oneCard:{
    borderRadius:15,
    alignSelf:"center",
    marginTop:"20px",
    width:"50%",
  },

    };

    
    ContactList.propTypes = {
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
      )( withStyles(styles)(ContactList));
          
