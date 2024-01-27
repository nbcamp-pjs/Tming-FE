import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const saveApplicant = (postId, job, accessToken, refreshToken) => {
  return instance.post('/v1/applicants', {
    postId: postId,
    job: job
  }, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const deleteApplicant = (applicantId, accessToken, refreshToken) => {
  return instance.delete('/v1/applicants', {
    data: {
      applicantId: applicantId
    },
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

const getApplicants = (postId, accessToken, refreshToken) => {
  return instance.get('/v1/applicants/' + postId, {
    headers: {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
  })
}

export {
    saveApplicant,
    deleteApplicant,
    getApplicants
}
