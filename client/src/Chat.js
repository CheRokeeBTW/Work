import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import './index.css';
import {motion, AnimatePresence} from "framer-motion";
import Modal from "./components/Modal/index.js";
import theme from './external/theme.png';

const getChatRoom = () => {
  const showRoom = sessionStorage.getItem("showRoom");
  return showRoom  ? JSON.parse(showRoom) : null
}

const getEnterRoom = () => {
  const enterRoom = sessionStorage.getItem("enterRoom");
  return enterRoom ? JSON.parse(enterRoom) : null
}

const getMessages = () => {
  const messagesStore = sessionStorage.getItem("messagesStore");
  return messagesStore ? JSON.parse(messagesStore) : null
}

function Chat({ socket, username}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [friend, setFriend] = useState("");
  const [friends, setFriends] = useState([]);
  const [enterRoom, setEnterRoom] = useState(getEnterRoom);
  const [room, setRoom] = useState(getChatRoom);
  const [friendShow, setFriendShow] = useState(false);
  const [roomLogOutShow, setRoomLogOutShow] = useState(false);
  const [messagesStore, setMessagesStore] = useState(getMessages);
  const [showErrorText, setShowErrorText] = useState(false);
  const [showErrorText1, setShowErrorText1] = useState(false);
  const [showErrorBlank, setShowErrorBlank] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); 
  const [password, setPassword] = useState("");
  const [friendAdded, setFriendAdded] = useState(false);

  const deleteData = () =>{
    fetch('http://localhost:3002/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    })
      .then(response => {
        return response.text();
      })
    }

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  useEffect(() => {
    socket.emit("join_room", room);
  }, [])

  useEffect(() => {
    sessionStorage.setItem('showRoom', JSON.stringify(room));
  }, [room])

  useEffect(() => {
    sessionStorage.setItem('enterRoom', JSON.stringify(enterRoom));
  }, [enterRoom])

  useEffect(() => {
    sessionStorage.setItem('messageStore', JSON.stringify(messagesStore));
  }, [messagesStore])

  useEffect( () =>{
    const getUserData = async() =>{
      const reqData = await fetch("http://localhost:3002/");
      const resData = await reqData.json();
      setUserData(resData);
      console.log(resData)
    }
    getUserData();
  },[]);

function show(){
let index = userData.findIndex(x => x.username === username);
  setFriends(userData[index].friends);
  setFriendShow(true);
}

function hide(){
  setFriends(null)
  setFriendShow(false)
}

  const addFriend = () => {
    if(username == friend){
      setShowErrorText(true);
      setShowErrorBlank(false);
      setFriendAdded(false)
    }
    else if(friend.length < 1){
      setShowErrorText(false);
      setShowErrorBlank(true);
      setFriendAdded(false)
    }
    else{
    axios.post('http://localhost:3002/friends', {username, friend})
    .then(res =>{
      if(res.data.validation){
        setShowErrorText(false);
        setShowErrorBlank(false);
        setFriendAdded(true)
        show()
        const getUserData = async() =>{
          const reqData = await fetch("http://localhost:3002/");
          const resData = await reqData.json();
          setUserData(resData);
          console.log(resData)
        }
        setShowErrorText1(false);
        getUserData();
      }
      else{
        setShowErrorText(false);
        setShowErrorBlank(false);
        setShowErrorText1(true);
        setFriendAdded(false)
      }
    })
  }
}

const getRandomTransformOrigin = () => {
  const value = (16 + 40 * Math.random()) / 100;
  const value2 = (15 + 36 * Math.random()) / 100;
  return {
    originX: value,
    originY: value2
  };
};

  const joinRoom = () => {
      socket.emit("join_room", room);
      setEnterRoom(true)
      setRoomLogOutShow(true)
}

const leaveRoom = () => {
  setRoomLogOutShow(false)
  setEnterRoom(false)
  setRoom(null)
}

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <motion.div className = "wrapper" >
      <div className = "users">
        <div className = "user-header">
          <h>Friends</h>
        </div>
        <div className="userList">
        <ScrollToBottom className="ScrollUser">
          {!friendShow ? (
          <button id = 'friendsList' onClick={show}>Show friend list</button>
        ) : (
          <button id = 'friendsListHide' onClick={hide}>Hide Friend list</button>
        )}
          <p id = "friends">{friends}</p>
          <div className="remove">
          <motion.button whileTap = {{scale:0.8}} id = "removeFriends" onClick={deleteData}>Remove</motion.button>
          </div>
          {roomLogOutShow ?(
          <button id ='leaveRoom' onClick = {leaveRoom}>Leave room</button>
        ): null}
          </ScrollToBottom>
        </div>
        <motion.div className = 'addFriend'>
         
          {showErrorText && (
            <p role="alert" style={{ color: "rgb(255, 0, 0)" }}>
            You cannot add yourself!
          </p>
        )}
        {showErrorText1 && (
            <p role="alert" style={{ color: "rgb(255, 0, 0)" }}>
            No user with this name was found!
          </p>
        )}
        {showErrorBlank && (
            <p role="alert" style={{ color: "rgb(255, 0, 0)" }}>
            Enter the name!
          </p>
        )}
        {friendAdded && (
            <p role="alert" style={{ color: "rgb(55, 204, 42)" }}>
            Friend added!
          </p>
        )}
        <motion.input id = "inputFriend"
            type="text"
            placeholder="Friend's name..."
            onChange={(event) => {
              setFriend(event.target.value);
            }}
            animate = {{scale: showErrorText ? [1,1.2,1]: 1}}
            transition={{ duration: 1 }}
          />
          <motion.button whileTap = {{scale:0.8}} id = "addFriendButton" onClick={addFriend}>Add a friend</motion.button>
        </motion.div>
        </div>
        <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
        <motion.img
        whileHover = {{scale:1.1}}
        whileTap = {{scale:0.9}}
        className = "theme" 
        onClick = {() => (modalOpen ? close() : open())}
        src = {theme} />
      </div>
      <div className="chat-body">
        {!enterRoom ? (
          <div className = "roomClass">
            <h1>Join Room</h1>
          <input
            type="text"
            placeholder="Room number..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <AnimatePresence
            initial = {false}
            exitBeforeEnter = {true}
            onExitComplete = {() => null}
            >
          {modalOpen && <Modal modalOpen = {modalOpen} handleClose = {close} />}
          </AnimatePresence>
          <div>
           <button id = "roomBtn" onClick={joinRoom}>Enter room</button>
           
           </div>
           </div>
        ): (
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
        )}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
    </motion.div>
  );
}

export default Chat;