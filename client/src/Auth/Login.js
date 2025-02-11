import "../App.css";
import io from "socket.io-client";
import { useState, useEffect, Suspense, lazy} from "react";
import Chat from "../Chat";
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios'
import {motion, AnimatePresence} from "framer-motion";
import sad from '../external/sad.png';
import {ClipLoader} from 'react-spinners';

const socket = io.connect("http://localhost:3001");

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

const getInitialState = () => {
  const showChat = sessionStorage.getItem("showChatState");
  return showChat  ? JSON.parse(showChat ) : null
}

const getUsername = () => {
  const showChat = sessionStorage.getItem("showUsernameState");
  return showChat  ? JSON.parse(showChat ) : null
}

const Login = () => {
  const [username, setUsername] = useState(getUsername);
  const [password, setPassword] = useState("");
  const [showChat, setShowChat] = useState(getInitialState);
  const [logInError, setLogInError] = useState(false); 
  const navigate = useNavigate();

  const close = () => setLogInError(false);

  useEffect(() => {
    sessionStorage.setItem('showChatState', JSON.stringify(showChat));
  }, [showChat])

  useEffect(() => {
    sessionStorage.setItem('showUsernameState', JSON.stringify(username));
  }, [username])

  const logData = () =>{
    axios.post('http://localhost:3002/data', {username, password})
    .then(res =>{
      if(res.data.validation){
    setShowChat(true)
    setLogInError(false)
      }
      else{
        setLogInError(true)
      }
    })
  }

  const register = () => {
      navigate('/register')
  };

  let inputStyle = {border: '2px solid #43a047'}
  
  logInError ? inputStyle.border = '2px solid red' : inputStyle.border = '2px solid #43a047'


  return (
    <div className="App">
       {!showChat ? (
        <div
        className="joinChatContainer"
        >
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
            <p>User does not exist</p>
            <img id = "sad" src = {sad}></img>
          </motion.div>}
          </AnimatePresence>
          <h3>Join A Chat</h3>
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
          <button onClick = {logData}>Log in</button>
          <button onClick={register}>Register</button>
        </div>): (
          <Suspense fallback={<div id = "loading"><ClipLoader/></div>}>
          <Chat socket={socket} username={username}/>
        </Suspense>
      )}
        </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;