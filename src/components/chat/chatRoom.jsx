import styles from './chatRoom.module.scss';
import ChatContent from "./content/chatContent";
import {useEffect, useRef, useState} from "react";
import {getRooms} from "../../apis/chat";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {useLocation, useNavigate} from "react-router-dom";
import alertify from "alertifyjs";

const ChatRoom = () => {
  const [rooms, setRooms] = useState([])

  const navigate = useNavigate()
  const location = useLocation();
  const roomId = location.state?.roomId;

  const [selectedRoom, setSelectedRoom] = useState(-1)
  const [clickedRoom, setClickedRoom] = useState(-1)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const roomRef = useRef([])

  const [client, setClient] = useState(null)

  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (selectedIdx === -1) return;

    if (roomRef.current[selectedIdx]) {
      roomRef.current[selectedIdx]?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [selectedIdx])

  useEffect(() => {
    if (roomId) {
      setSelectedRoom(() => roomId);
      setClickedRoom(() => roomId);
    }

    getRooms(accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        setRooms(res.data.data.roomGetAllReses)
      }
    })
    .catch(err => {
      alertify.error("로그인 세션이 만료되었습니다.<br/>로그인 화면으로 이동합니다.")
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      navigate('/login');
    })
  }, [])

  useEffect(() => {
    if (!rooms) return;

    rooms.map((room, idx) => {
      if (room.roomInfoRes.chatRoomId === roomId) {
        setSelectedIdx(() => idx);
      }
    })
  }, [rooms])

  useEffect(() => {
    if (client) client.deactivate();
  }, [selectedRoom])

  const goToRoom = (roomId) => {
    setSelectedRoom(() => roomId);
  }

  const clickRoom = (roomId) => {
    setClickedRoom(() => roomId);
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.rooms}>
          {rooms && rooms.length? rooms.map((room, idx) => (
              <div
                  ref={(el) => (roomRef.current[idx] = el)}
                  key={idx}
                  className={`${styles.room} ${clickedRoom === room.roomInfoRes.chatRoomId && styles.clicked}`}
                  onClick={() => clickRoom(room.roomInfoRes.chatRoomId)}
                  onDoubleClick={() => goToRoom(room.roomInfoRes.chatRoomId)}
              >
                {room.roomInfoRes.username} 님과의 채팅
              </div>
          )): <div style={{position: 'absolute', width: '100%'}}>채팅방이 없습니다.<br/>상대방의 프로필에서 1:1 채팅하기를 눌러서 채팅해보세요!</div>}
        </div>
        {selectedRoom !== -1 && <ChatContent roomId={selectedRoom} client={client} setClient={setClient}/>}
      </div>
  )
}

export default ChatRoom;
