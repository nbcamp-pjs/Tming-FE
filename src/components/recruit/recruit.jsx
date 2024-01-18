import styles from './recruit.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../states";

const Recruit = () => {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/');
    }
  }, [])

  return (
      <div className={styles.wrapper}>
        this is recruit page
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
  );
}

export default Recruit;
