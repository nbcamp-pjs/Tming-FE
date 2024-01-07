import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

const logoutUser = () => {
  return instance.post('/v1/users/logout')
}

export {
  signupUser,
  loginUser,
  logoutUser,
}
