import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signupUser} from '../../apis/user';

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [job, setJob] = useState('BACKEND')
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
        email: <input type="text" onChange={onChangeEmail} value={email}/><br/>
        password: <input type="password" onChange={onChangePassword} value={password}/><br/>
        username: <input type="text" onChange={onChangeUsername} value={username}/><br/>
        job: <select value={job} onChange={onChangeJob}>
          <option value="BACKEND">Backend</option>
          <option value="FRONTEND">Frontend</option>
          <option value="IOS">iOS</option>
          <option value="ANDROID">Android</option>
          <option value="DESIGNER">Designer</option>
        </select><br/>
        <button onClick={signup}>signup</button>
        <button onClick={login}>login</button>
      </div>
  )
}

export default Signup;
