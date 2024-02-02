import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const saveChatRoom = (userId, roomName, accessToken, refreshToken) => {
  return instance.post('/v1/rooms', {
    userId: userId,
    name: roomName
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getRooms = (accessToken, refreshToken) => {
  return instance.get(`/v1/rooms`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getRoom = (roomId, accessToken, refreshToken) => {
  return instance.get(`/v1/rooms/${roomId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  });
}

const getRoomByUsers = (userId, accessToken, refreshToken) => {
  return instance.get(`/v1/rooms/chat?receiverId=${userId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  });
}

export {
  saveChatRoom,
  getRooms,
  getRoom,
  getRoomByUsers,
}
