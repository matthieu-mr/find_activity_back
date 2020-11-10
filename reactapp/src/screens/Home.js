import React from 'react';
import { Button } from '@material-ui/core';
import {Link} from 'react-router-dom';

function Home(props) {
    const preventDefault = (event) => event.preventDefault();

  return (
    <div style={styles.body}>
        <p>
          Home 3 - coucou
        </p>
        
        <Link to="/newpasswordaa@a.com" >   
        <Button variant="contained" color="primary">
            Lien
        </Button>
                 
            </Link>
    </div>
  );
}

const styles = {

    body:{
      backgroundColor:"#eceff1",
      display:"flex",
      flexDirection:"column",
      flex:1,
      alignItem:"center"
    },

    };
    

export default Home;
