import "../App.css";
import io from "socket.io-client";
import { useState} from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios'
import {motion, AnimatePresence} from "framer-motion";
import sad from '../external/sad.png'

const badSuspension = {
  visible: {
    y: "-5vh",
    opacity: 1,
    transition: {
      duration: 1,
      type: "spring",
      damping: 5,
      stiffness: 450,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};

async function LoginUser(credentials) {
  return fetch('http://localhost:3002/login',{
      method: 'POST',
      header: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
  }).then(data => data.json())
}

function Register({setToken}) {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [logInError, setLogInError] = useState(false); 


  const close = () => setLogInError(false);

  const registerUser = () =>{
    axios.post('http://localhost:3002/registerData', {username})
    .then(res =>{
      if(res.data.validation){
        setLogInError(true)
      }
      else{
        fetch('http://localhost:3002/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
          })
            .then(response => {
              return response.text();
            })
            .then(data => {
              const handleSubmit = async () => {
                const token = await LoginUser({
                    username,
                    password
                })
                 
            }; handleSubmit();
            setLogInError(false)
                 navigate("/chat")
            })
      }
    })
  }

  let inputStyle = {border: '2px solid #43a047'}
  
  logInError ? inputStyle.border = '2px solid red' : inputStyle.border = '2px solid #43a047'

  const login = () => {
    navigate('/login')
   
  }

  return (
    <div className="App">
        <div className="joinChatContainer">
           <AnimatePresence
                      initial = {false}
                      exitBeforeEnter = {true}
                      onExitComplete = {() => null}>
                    {logInError &&
                    <motion.div
                    variants = {badSuspension}
                    animate = "visible"
                    exit = "exit"
                    className = "error"
                    onClick = {close}
                    >
                      <p>Name already exists</p>
                      <img id = "sad" src = {sad}></img>
                    </motion.div>}
                    </AnimatePresence>
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder="John..."
            style = {inputStyle}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Password..."
            style = {inputStyle}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button onClick={registerUser}>Create an account</button>
          <button onClick={login}>Join with existing account</button>
        </div>
        </div>
  );
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Register;