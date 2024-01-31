import styles from './chatRoom.module.scss';
import ChatContent from "./content/chatContent";

const ChatRoom = () => {
  return (
      <div className={styles.wrapper}>
        <ChatContent roomId={1}/>
      </div>
  )
}

export default ChatRoom;
