import styles from './profile.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUserProfile} from "../../apis/user";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {getImg} from "../../apis/awss3";

const Profile = () => {
  const params = useParams();
  const userId = params.userId;
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    getUserProfile(userId, accessToken, refreshToken)
    .then(res => {
      setUser(res.data.data);
      console.log(user)
      if (user.profileImageUrl) {
        setImgUrl(getImg(user.profileImageUrl));
      } else {
        setImgUrl(getImg("test/loopy-goonchim.png"));
      }
    })
  }, [])

  return (
      <div className={styles.wrapper}>
        <div>
          {user.email}
        </div>
        <div>
          {user.username}
        </div>
        <div>
          {user.job}
        </div>
        <div>
          {user.introduce}
        </div>
        <div>
          {user.following}
        </div>
        <div>
          {user.follower}
        </div>
        <div>
          <img src={imgUrl} width='100px'/><br/>
        </div>
      </div>
  )
}

export default Profile;
