import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAllSamples = (accessToken, refreshToken) => {
  return instance.get('/v1/sample', {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  });
}

const insertSample = (title, text, accessToken, refreshToken) => {
  return instance.post('/v1/sample', {
    title: title,
    text: text
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
  getAllSamples,
  insertSample
}
