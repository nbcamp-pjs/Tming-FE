import styles from './chatRoom.module.scss';
import ChatContent from "./content/chatContent";
import {useEffect, useState} from "react";
import {getRooms} from "../../apis/chat";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../states";

const ChatRoom = () => {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(-1)
  const [client, setClient] = useState(null)

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    getRooms(accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        console.log(res.data.data)
        setRooms(res.data.data.roomGetAllReses)
      }
    })
  }, [])

  useEffect(() => {
    if (client) client.deactivate();
  }, [selectedRoom])

  const goToRoom = (roomId) => {
    setSelectedRoom(() => roomId);
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.rooms}>
          {rooms && rooms.map((room, idx) => (
              <div key={idx} className={styles.room}>
                {room.roomInfoRes.chatRoomName}
                <button onClick={() => goToRoom(room.roomInfoRes.chatRoomId)}>입장</button>
              </div>
          ))}
        </div>
        {selectedRoom !== -1 && <ChatContent roomId={selectedRoom} client={client} setClient={setClient}/>}
      </div>
  )
}

export default ChatRoom;
