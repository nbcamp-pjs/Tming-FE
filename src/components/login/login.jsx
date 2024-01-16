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
    .then(res1 => {
      setAccessToken(res1.headers.accesstoken)
      setRefreshToken(res1.headers.refreshtoken)
      getUserProfile(res1.data.data.userId, accessToken, refreshToken)
      .then(res2 => {
        alert('success login')
        setUser(res2.data.data);
        navigate('/')
      })
    })
    .catch(err => {
      console.log(err)
      alert('계정을 확인해주세요')
    })
    .finally(() => {
      setEmail('')
      setPassword('')
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
        <div className={styles.inputs}>
          <div className={styles.email}>
            <input type="text" onChange={onChangeEmail} value={email} placeholder="email"/><br/>
          </div>
          <div className={styles.password}>
            <input type="password" onChange={onChangePassword} value={password} placeholder="password"/><br/>
          </div>
          <div className={styles.btns}>
            <button className={styles.btn} onClick={login}>login</button>
          </div>
          <div className={styles.signup} onClick={signup}>
            회원가입
          </div>
        </div>
      </div>
  )
}

export default Login;
