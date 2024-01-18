import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const instanceFormData = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const savePost = (formData, accessToken, refreshToken) => {
  return instanceFormData.post('/v1/posts', formData, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const updatePost = (formData, accessToken, refreshToken) => {
  return instanceFormData.patch('/v1/posts', formData, {
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

const getPosts = (type, skill, job, accessToken, refreshToken) => {
  return instanceFormData.get('/v1/posts', {
    params: {
      type: type,
      skill: skill,
      job: job
    },
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getPost = (postId, accessToken, refreshToken) => {
  return instance.get('/v1/posts/' + postId, {
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
  unlikePost,
  getPosts,
  getPost,
}
