import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getAllSamples = () => {
  return instance.get('/v1/sample');
}

const insertSample = (title, text) => {
  return instance.post('/v1/sample', {
    title: title,
    text: text
  })
}

export {
  getAllSamples,
  insertSample
}
