import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signupUser} from '../../apis/user';

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [job, setJob] = useState('')
  const navigate = useNavigate()

  const login = () => {
    navigate('/login')
  }

  const signup = () => {
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
        <input type="text" onChange={onChangeEmail} value={email}/><br/>
        <input type="password" onChange={onChangePassword} value={password}/><br/>
        <input type="text" onChange={onChangeUsername} value={username}/><br/>
        <input type="text" onChange={onChangeJob} value={job}/><br/>
        <button onClick={signup}>signup</button>
        <button onClick={login}>login</button>
      </div>
  )
}

export default Signup;
