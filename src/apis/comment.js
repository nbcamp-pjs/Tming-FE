import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const saveComment = (postId, content, accessToken, refreshToken) => {
  return instance.post('/v1/comments', {
    postId: postId,
    content: content
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const updateComment = (commentId, content, accessToken, refreshToken) => {
  return instance.patch('/v1/comments', {
    commentId: commentId,
    content: content
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const deleteComment = (commentId, accessToken, refreshToken) => {
  return instance.delete('/v1/comments', {
    data: {
      commentId: commentId
    },
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getComments = (postId, accessToken, refreshToken) => {
  return instance.get(`/v1/comments/${postId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
    saveComment,
    updateComment,
    deleteComment,
    getComments,
}
