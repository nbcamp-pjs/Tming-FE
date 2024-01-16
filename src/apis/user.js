import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const checkEmail = (email) => {
  return instance.post('/v1/users/check-email', {
    email: email
  })
}

const checkUsername = (username) => {
  return instance.post('/v1/users/check-username', {
    username: username
  })
}

const signupUser = (email, password, username, job) => {
  return instance.post('/v1/users/signup', {
    email: email,
    password: password,
    username: username,
    job: job
  })
}

const loginUser = (email, password) => {
  return instance.post('/v1/users/login', {
    email: email,
    password: password
  })
}

const logoutUser = (accessToken, refreshToken) => {
  return instance.post('/v1/users/logout', {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getUserProfile = (userId, accessToken, refreshToken) => {
  return instance.get(`/v1/users/${userId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  });
}

const updateUser = (password, username, job, introduce, accessToken, refreshToken) => {
  return instance.patch('/v1/users', {
    password: password,
    username: username,
    job: job,
    introduce: introduce
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const followUser = (followingId, accessToken, refreshToken) => {
  return instance.post('/v1/users/follow', {
    followingId: followingId
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const unfollowUser = (followingId, accessToken, refreshToken) => {
  return instance.post('/v1/users/unfollow', {
    followingId: followingId
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getFollowers = (userId, accessToken, refreshToken) => {
  return instance.get(`/v1/users/follower/${userId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getFollowings = (userId, accessToken, refreshToken) => {
  return instance.get(`/v1/users/following/${userId}`, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
  checkEmail,
  checkUsername,
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
}
