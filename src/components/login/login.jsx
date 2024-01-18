import styles from './login.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUserProfile, loginUser} from '../../apis/user';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (userId == null || accessToken == null || refreshToken == null) {
      return;
    }

    getUserProfile(userId, accessToken, refreshToken)
    .then(res2 => {
      alertify.success("로그인 완료되었습니다.", "1.2");
      setUser(res2.data.data);
      navigate('/')
    })
  }, [userId, accessToken, refreshToken])

  const login = () => {
    loginUser(email, password)
    .then(res1 => {
      setAccessToken(res1.headers.accesstoken)
      setRefreshToken(res1.headers.refreshtoken)
      setUserId(res1.data.data.userId)
    })
    .catch(err => {
      console.log(err)
      alertify.error("계정을 확인해주세요.", "1.2");
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
            <button className={styles.btn} onClick={login}>로그인</button>
          </div>
          <div className={styles.signup} onClick={signup}>
            회원가입
          </div>
        </div>
      </div>
  )
}

export default Login;
