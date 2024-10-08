import styles from './chatContent.module.scss';
import {useEffect, useRef, useState} from "react";
import * as StompJs from "@stomp/stompjs";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../../states";
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate} from "react-router-dom";
import {getRoom} from "../../../apis/chat";

const ChatContent = (props) => {
  const {roomId, client, setClient} = props
  const [chatList, setChatList] = useState([]);
  const [msgs, setMsgs] = useState(Array(2).fill(''))

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const [user, setUser] = useRecoilState(userState)
  const [anotherUser, setAnotherUser] = useState(null)

  const navigate = useNavigate()
  const DEBOUNCE_TIME = 1000;

  const chatRef = useRef(null)

  useEffect(() => {
    getRoom(roomId, accessToken, refreshToken)
    .then(res => {
      if (res.data.data) {
        const newArr = []
        res.data.data.roomMessageResList.roomMessageRese.map((c, idx) => {
          newArr.push({
            userId: c.userId,
            msg: c.content,
            time: c.createTimestamp
          })
        })
        setChatList(() => newArr)

        if (res.data.data.roomUserInfoReses[0].userId === user.userId) {
          const newAnotherUser = {
            username: res.data.data.roomUserInfoReses[1].username,
            imageUrl: res.data.data.roomUserInfoReses[1].imageUrl
          }
          setAnotherUser(() => newAnotherUser)
        } else {
          const newAnotherUser = {
            username: res.data.data.roomUserInfoReses[0].username,
            imageUrl: res.data.data.roomUserInfoReses[0].imageUrl
          }
          setAnotherUser(() => newAnotherUser)
        }
      }
    })

    const clientData = new StompJs.Client({
      brokerURL: process.env.REACT_APP_BROKER_URL,
      connectHeaders: {
        AccessToken: accessToken,
        RefreshToken: refreshToken
      },
      reconnectDelay: 5000,
    });

    clientData.onConnect = () => {
      clientData.subscribe("/sub/v1/rooms/" + roomId, callback);
    };

    clientData.activate();
    setClient(clientData);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId])

  useEffect(() => {
    if (!client) return;

    const debounce = setTimeout(() => {
      if (!client.connected) {
        alertify.error('세션이 만료되었습니다.<br/>로그인 화면으로 돌아갑니다.', "1.2");
        client.deactivate();
        setAccessToken(null)
        setRefreshToken(null)
        setUser(null)
        navigate('/login');
      }
    }, DEBOUNCE_TIME); // 새로운 타이머 설정

    return () => clearTimeout(debounce);
  }, [client])

  useEffect(() => {
    scrollToBottom();
  }, [chatList])

  const callback = (res) => {
    if (res.body) {
      let msg = JSON.parse(res.body);
      setChatList((chats) => [...chats, {userId: msg.senderId, msg: msg.content, time: msg.createTimestamp}]);
      if (msg.senderId === user.userId) {
        setMsgs(prev => {
          prev[0] = '';
          return [...prev]
        })
      } else {
        setMsgs(prev => {
          prev[1] = '';
          return [...prev]
        })
      }
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (!msgs[0] || !msgs[0].length) {
      alertify.error('내용을 작성해주세요.', '1.2');
      return;
    }

    const chatReq = {
      roomId: roomId,
      senderId: user.userId,
      content: msgs[0]
    }

    client.publish({
      destination: `/pub/chats/${roomId}`,
      body: JSON.stringify(chatReq)
    })
  };

  const onChangeMsg = (e) => {
    let updatedValue = e.target.value;
    if (updatedValue && updatedValue.length > 100) {
      alertify.error('메시지는 100자 이내로 작성해주세요.', '1.2');
      updatedValue = updatedValue.slice(0, 100);
    }
    setMsgs(prev => {
      prev[0] = updatedValue;
      return [...prev]
    })
  }

  const onEnterKey = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
      <div className={styles.wrapper}>
        <div ref={chatRef} className={styles.scroll}>
          <div className={styles.chats}>
            {chatList && chatList.map((chat, idx) => (
                <div key={idx} className={`${styles.chat} ${user && chat.userId === user.userId? styles.my: styles.another}`}>
                  <div className={`${user && user.userId === chat.userId? styles.myProfile: styles.anotherProfile}`}>
                    <div className={styles.username}>
                      {user && anotherUser && user.userId === chat.userId? user.username: anotherUser.username}
                    </div>
                  </div>
                  <div className={`${user && user.userId === chat.userId? styles.myContent: styles.anotherContent}`}>
                    <div className={styles.time}>
                      {chat.time}
                    </div>
                    <div className={styles.msg}>
                      {chat.msg}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
        <div className={styles.typing}>
          <input type="text" value={msgs[0]} onChange={onChangeMsg} onKeyDown={onEnterKey}/>
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
  )
}

export default ChatContent;
