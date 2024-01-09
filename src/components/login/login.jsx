import styles from './login.module.scss';
import {useRecoilState} from "recoil";
import {userState} from "../../states";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginUser} from '../../apis/user';
import {getImg} from "../../apis/awss3";

const Login = () => {
  const [user, setUser] = useRecoilState(userState)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    setImgUrl(getImg("test/loopy-goonchim.png"));
  }, [])

  const login = () => {
    console.log('email = '+ email);
    console.log('password = '+ password);
    loginUser(email, password)
    .then(res => {
      alert('success login')
      setUser({email: email})
      navigate('/')
    })
  }

  const signup = () => {
    navigate('/signup')
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  return (
      <div className={styles.wrapper}>
        <img src={imgUrl} width='100px'/><br/>
        email: <input type="text" onChange={onChangeEmail} value={email}/><br/>
        password: <input type="password" onChange={onChangePassword} value={password}/><br/>
        <button onClick={login}>login</button>
        <button onClick={signup}>signup</button>
      </div>
  )
}

export default Login;
