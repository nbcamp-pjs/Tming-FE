import styles from './login.module.scss';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUserProfile, loginUser} from '../../apis/user';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  const login = () => {
    loginUser(email, password)
    .then(res => {
      alert('success login')
      setAccessToken(res.headers.accesstoken)
      setRefreshToken(res.headers.refreshtoken)
      setUser({email: email})
      getUserProfile(1, accessToken, refreshToken)
      .then(res => {
        console.log(res.data)
        setUser(res.data.data);
        navigate('/')
      })
    })
    .catch(err => {
      console.log(err)
      alert('계정을 확인해주세요')
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
        email: <input type="text" onChange={onChangeEmail} value={email}/><br/>
        password: <input type="password" onChange={onChangePassword} value={password}/><br/>
        <button onClick={login}>login</button>
        <button onClick={signup}>signup</button>
      </div>
  )
}

export default Login;
