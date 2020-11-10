import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useParams } from "react-router";
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import WebIcon from '@material-ui/icons/Web';
import SendIcon from '@material-ui/icons/Send';

function NewPassword(props) {
 // let { id } = useParams();
console.log("hello",props.match.params.id)

const [pwd1,setPwd1] = useState()
const [pwd2,setPwd2] = useState()

console.log(pwd1)
let sendNewPwd =async ()=>{
  var rawResponse = await fetch('users/changepassword', {
                                  method: 'POST',
                                  headers: {'Content-Type':'application/x-www-form-urlencoded'},
                                  body: 'name=john&username=doe&email=john@gmail.com'
                                });
  var response = await rawResponse.json();                    
  console.log("pressed ",response)
}

  return (
    <div className="App">
        <p>
          New Password
        </p>

        <div> 
          <TextField required id="standard-required" label="Required" defaultValue="" onChange={(e) => setPwd1(e.target.value)} />
          <TextField required id="standard-required" label="Required" defaultValue="" onChange={(e) => setPwd2(e.target.value)} />
        </div>
        <Button
        variant="contained"
        color="primary"
        className={props.button}
        endIcon={<SendIcon/>}
        onClick={sendNewPwd}>
        Send
      </Button>
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
  button: {
   marginTop:'100px'
  },

  };

export default NewPassword;
