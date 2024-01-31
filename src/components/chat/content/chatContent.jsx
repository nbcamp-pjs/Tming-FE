import {useEffect, useRef, useState} from "react";
import * as StompJs from "@stomp/stompjs";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../../states";
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate} from "react-router-dom";

const ChatContent = (props) => {
  const {roomId} = props
  const [client, setClient] = useState(null);
  const [chatList, setChatList] = useState([]);

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const [user, setUser] = useRecoilState(userState)

  const navigate = useNavigate()
  const DEBOUNCE_TIME = 1000;

  const [msg, setMsg] = useState('')

  useEffect(() => {
    // TODO fix to wss://alpha.whenwheres.com/ws
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
  }, [])

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

  const callback = (res) => {
    if (res.body) {
      let msg = JSON.parse(res.body);
      setChatList((chats) => [...chats, msg.content]);
    }
    setMsg('');
  };

  const sendMessage = () => {
    if (!msg || !msg.length) {
      alertify.error('내용을 작성해주세요.', '1.2');
      return;
    }

    const chatReq = {
      roomId: 1,
      senderId: 1,
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
      <div>
        <input type="text" value={msg} onChange={onChangeMsg} onKeyDown={onEnterKey}/>
        <button onClick={sendMessage}>send</button>
        {chatList && chatList.map((chat, idx) => (
            <div key={idx}>
              {chat}
            </div>
        ))}
      </div>
  )
}

export default ChatContent;
