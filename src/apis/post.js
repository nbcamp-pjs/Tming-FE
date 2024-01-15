import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const savePost = (data, accessToken, refreshToken) => {
  return instance.post('/v1/posts', {
    request: data
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const updatePost = (data, accessToken, refreshToken) => {
  return instance.patch('/v1/posts', {
    request: data
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const deletePost = (data, accessToken, refreshToken) => {
  return instance.delete('/v1/posts', {
    postDeleteReq: data
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const likePost = (data, accessToken, refreshToken) => {
  return instance.post('/v1/posts/like', {
    postLikeReq: data
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const unlikePost = (data, accessToken, refreshToken) => {
  return instance.post('/v1/posts/unlike', {
    postUnlikeReq: data
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
  savePost,
  updatePost,
  deletePost,
  likePost,
  unlikePost
}
