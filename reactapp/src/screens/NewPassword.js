import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useParams } from "react-router";
import TextField from '@material-ui/core/TextField';
import { withStyles  } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
<link rel="stylesheet" href='https://fonts.googleapis.com/css2?family=Sansita+Swashed:wght@300&display=swap' />


function NewPassword(props) {
 // let { id } = useParams();
 const { classes } = props;

const [pwd1,setPwd1] = useState()
const [pwd2,setPwd2] = useState()
const [alertPassword,setAlertPassword] = useState()
const [sendRequest,setSendRequest] = useState(false)

const [open, setOpen] = React.useState(false);

const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const bodyModal = (
  <div style={styles.modal}>
    <h2 id="simple-modal-title">Text in a modal</h2>
    <p id="simple-modal-description">
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </p>

  </div>
);


let sendNewPwd =async ()=>{
  handleOpen()

  const expressionPass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  let resultPass = expressionPass.test(pwd1)
  if(!resultPass){
    setAlertPassword(
          <h2 style={styles.alertMessage}>Le mot de passe doit contenir au moins 6 charactères, 1 majuscule et 1 chiffre</h2>
      )
  } else if(pwd1 !== pwd2){
    setAlertPassword(<h2 style={styles.alertMessage}> <ReportProblemIcon fontSize="large" /> Les deux mots de passes doivent être identiques</h2>)
  }  else{setAlertPassword()}

  if(!resultPass&&pwd1 == pwd2 ){
    var rawResponse = await fetch('users/changepassword', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `email=${props.match.params.id}&password=${pwd2}`
    });
  var response = await rawResponse.json();  
  }


  
                  
  console.log("pressed ",response)
}

  return (
    <div style={styles.body}>

        <div style={styles.card}> 
          <h2 style={styles.titleCard}> Créer un nouveau mot de passe</h2>
          <div style={styles.inputContainer}>
          <TextField required id="standard-required" style={styles.inputStyle} label="Nouveau Mot de Passe" defaultValue="" onChange={(e) => setPwd1(e.target.value)} />
          <TextField required id="standard-required"  style={styles.inputStyle} label="Valider mot de passe" defaultValue="" onChange={(e) => setPwd2(e.target.value)} />
          {alertPassword}
          </div>

          <div style={styles.inputContainer}>
            <Button
            variant="contained"
            style={styles.button}
            endIcon={<SendIcon/>}
            onClick={sendNewPwd}>
            Valider
            </Button>
          </div>

        </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={styles.modalContainer}
      >
        {bodyModal}
      </Modal>
    </div>
 
  );
}

const styles = {
  body:{
    backgroundColor: '#80d6ff',
    display:"flex",
    flexDirection:"column",
    flex:1,
    alignItems:"center",
    alignContent:"center",
    minHeight: "100vh",
    justifyContent:'center',
  },  
  titleCard:{
    fontFamily:'Sansita Swashed', 
    color:"#0077c2",
    fontSize:40,
  },
  alertMessage:{
  color:"red"
  },
  card:{
    backgroundColor:"white",
    width:"50%",
    padding:20,
    borderRadius:20
  },
  inputContainer:{
    display:"flex",
    flexDirection:"column",
    marginTop:50
  },
  inputStyle:{
    marginTop:20,
  },
  button: {
    borderRadius: 35,
    padding: "18px 36px",
    fontSize: "18px",
    color:"white",
   backgroundColor: '#0063cc',
  },
modalContainer:{
  display:"flex",
  flexDirection:"column",
  flex:1,
  alignItems:"center",
  alignContent:"center",
  minHeight: "100vh",
  justifyContent:'center',
},

modal:{
  backgroundColor: '#80d6ff',
  backgroundColor:"white",
  width:"50%",
  padding:20,
  borderRadius:20,
  alignSelf:'center'
}
  };

export default NewPassword;
