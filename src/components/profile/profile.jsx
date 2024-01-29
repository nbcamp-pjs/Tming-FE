import styles from './profile.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {followUser, getUserProfile, unfollowUser} from "../../apis/user";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {getImg} from "../../apis/awss3";
import UpdateProfile from "./update/updateProfile";

const Profile = () => {
  const params = useParams();
  const userId = Number(params.userId);
  const [anotherUser, setAnotherUser] = useState(null);
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const [imgUrl, setImgUrl] = useState('')

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    getUserProfile(userId, accessToken, refreshToken)
    .then(res => {
      setAnotherUser(() => res.data.data);
      console.log(res.data.data.profileImageUrl)
      if (res.data.data && res.data.data.profileImageUrl) {
        setImgUrl(() => getImg(res.data.data.profileImageUrl));
      } else {
        setImgUrl(() => getImg("test/loopy-goonchim.png"));
      }
    })
  }, [])

  const clickFollowUser = () => {
    followUser(userId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 3005) {
        alertify.error(res.data.message, "1.2");
      } else {
        alertify.success("팔로우 되었습니다.", "1.2");
      }
      window.location.reload();
    })
  }

  const clickUnfollowUser = () => {
    unfollowUser(userId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 3006) {
        alertify.error(res.data.message, "1.2");
      } else {
        alertify.success("팔로우가 취소되었습니다.", "1.2");
      }
      window.location.reload();
    })
  }

  const showFollowBtn = () => {
    return <button onClick={clickFollowUser}>팔로우</button>
  }

  const showUnfollowBtn = () => {
    return <button onClick={clickUnfollowUser}>팔로우 취소</button>
  }

  const showFollowDiv = () => {
    return <div className={styles.followBtn}>
      {anotherUser && anotherUser.followed? showUnfollowBtn(): showFollowBtn()}
    </div>
  }

  const closeIsUpdating = () => {
    setIsUpdating(false);
  }

  const updateModal = () => {
    setIsUpdating(true);
  }

  const updateBtn = () => {
    return <button onClick={updateModal}>프로필 수정</button>
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.profileWrapper}>
          <div className={styles.profile}>
            <div className={styles.image}>
              <img src={imgUrl} width='100px'/><br/>
            </div>
            <div className={styles.username}>
              {anotherUser && anotherUser.username}
            </div>
            <div className={styles.job}>
              {anotherUser && anotherUser.job}
            </div>
            <div>
              {anotherUser && anotherUser.introduce? anotherUser.introduce: "자기소개를 입력해주세요."}
            </div>
          </div>

          <div className={styles.followWrapper}>
            <div className={styles.follow}>
              <div className={styles.following}>
                <div className={styles.text}>
                  팔로잉
                </div>
                <div className={styles.cnt}>
                  {/*클릭 시 팔로잉 리스트 조회*/}
                  {anotherUser && anotherUser.follower}
                </div>
              </div>
              <div className={styles.follower}>
                <div className={styles.text}>
                  {/*클릭 시 팔로워 리스트 조회*/}
                  팔로워
                </div>
                <div className={styles.cnt}>
                  {anotherUser && anotherUser.following}
                </div>
              </div>
            </div>
            {user && userId !== user.userId && showFollowDiv()}
            {isUpdating && <UpdateProfile user={user} close={closeIsUpdating}/>}
            {user && userId === user.userId && updateBtn()}
          </div>
        </div>
      </div>
  )
}

export default Profile;
