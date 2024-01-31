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

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const [user, setUser] = useRecoilState(userState)

  const navigate = useNavigate()
  const DEBOUNCE_TIME = 1000;

  const [msg, setMsg] = useState('')

  const chatRef = useRef(null)

  useEffect(() => {
    getRoom(roomId, accessToken, refreshToken)
    .then(res => {
      if (res.data.data) {
        const newArr = []
        res.data.data.roomMessageResList.roomMessageRese.map((c, idx) => {
          newArr.push({
            userId: c.userId,
            msg: c.content
          })
        })
        setChatList(() => newArr)
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

    // 구독
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
      setChatList((chats) => [...chats, {userId: msg.senderId, msg: msg.content}]);
    }
    setMsg('');
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (!msg || !msg.length) {
      alertify.error('내용을 작성해주세요.', '1.2');
      return;
    }

    const chatReq = {
      roomId: roomId,
      senderId: user.userId,
      content: msg
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
    setMsg(() => updatedValue);
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
        <div ref={chatRef} className={styles.chats}>
          {chatList && chatList.map((chat, idx) => (
              <div key={idx} className={`${styles.chat} ${chat.userId === user.userId? styles.my: styles.another}`}>
                {chat.userId} | {chat.msg}
              </div>
          ))}
        </div>
        <div className={styles.typing}>
          <input type="text" value={msg} onChange={onChangeMsg} onKeyDown={onEnterKey}/>
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
  )
}

export default ChatContent;
