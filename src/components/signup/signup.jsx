import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signupUser} from '../../apis/user';
import {jobs} from "../../utils/jobs";

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [job, setJob] = useState('BACKEND')
  const navigate = useNavigate()
  const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const usernameRegex = /^[a-zA-Z0-9가-힣]{4,12}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,16}$/;

  const login = () => {
    navigate('/login')
  }

  const validateEmail = (email) => {
    return emailRegex.test(email);
  }

  const validateUsername = (username) => {
    return usernameRegex.test(username);
  }

  const validatePassword = (password) => {
    return passwordRegex.test(password);
  }

  const signup = () => {
    if (!validateEmail(email)) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }

    if (!validateUsername(username)) {
      alert('닉네임 형식을 확인해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      alert('패스워드 형식을 확인해주세요.');
      return;
    }

    signupUser(email, password, username, job)
    .then(res => {
      alert('success signup');
      navigate('/');
    })
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  }

  const onChangeJob = (e) => {
    setJob(e.target.value);
  }

  return (
      <div>
        email: <input type="text" onChange={onChangeEmail} value={email}/><br/>
        password: <input type="password" onChange={onChangePassword} value={password}/><br/>
        username: <input type="text" onChange={onChangeUsername} value={username}/><br/>
        job: <select value={job} onChange={onChangeJob}>
          {jobs.map((job, idx) => {
            return <option key={idx} value={job.value}>{job.title}</option>
          })}
        </select><br/>
        <button onClick={signup}>signup</button>
        <button onClick={login}>login</button>
      </div>
  )
}

export default Signup;
