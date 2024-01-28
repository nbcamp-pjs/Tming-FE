import axios, {post} from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const saveMember = (userId, postId, job, accessToken, refreshToken) => {
  return instance.post('/v1/members', {
    postId: postId,
    userId: userId,
    job: job
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const deleteMember = (userId, postId, accessToken, refreshToken) => {
  return instance.delete('/v1/members', {
    data: {
      postId: postId,
      userId: userId
    },
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getMembers = (postId, accessToken, refreshToken) => {
  return instance.get('/v1/members/' + postId, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
    saveMember,
    deleteMember,
    getMembers,
}
