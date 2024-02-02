import styles from './updateProfile.module.scss';
import {Close, LoopyGoonchim} from "../../../assets";
import {jobs} from "../../../utils/jobs";
import {useEffect, useRef, useState} from "react";
import {getImg} from "../../../apis/awss3";
import {getUserProfile, updateUser} from "../../../apis/user";
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useRecoilState, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../../states";

const UpdateProfile = (props) => {
  const {user, close} = props;
  const [imgUrl, setImgUrl] = useState('')

  const [job, setJob] = useState('')
  const [intro, setIntro] = useState('')
  const [username, setUsername] = useState('')

  const imgRef = useRef()
  const [completed, setCompleted] = useState(false)

  const setUser = useSetRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  const usernameRegex = /^[a-zA-Z0-9가-힣]{4,12}$/;

  useEffect(() => {
    if (user && user.profileImageUrl) {
      setImgUrl(getImg(user.profileImageUrl));
    } else {
      setImgUrl(LoopyGoonchim);
    }

    jobs.map((j, idx) => {
      if (j.title === user.job) {
        setJob(j.value)
      }
    })

    setIntro(user.introduce? user.introduce: '')
    setUsername(user.username)
  }, [])

  useEffect(() => {
    if (!completed) return;

    getUserProfile(user.userId, accessToken, refreshToken)
    .then(res => {
      setUser(res.data.data);
      alertify.success("프로필이 수정되었습니다.", "1.2");
      window.location.reload();
      close();
    })
  }, [completed])

  const validateUsername = (username) => {
    return usernameRegex.test(username);
  }

  const modifyUser = () => {
    if (!validateUsername(username)) {
      alertify.error("username은 4자 이상, 12자 이하인 대소문자, 숫자, 한글로 구성되어야 합니다.", "1.2");
      return;
    }

    if (job === '') {
      alertify.error("직군을 선택해주세요.", "1.2");
      return;
    }

    const formData = new FormData();
    const data = {
      userId: user.userId,
      username: username,
      job: job,
      introduce: intro,
      profileImageUrl: user.profileImageUrl
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("userUpdateReq", blob);
    if (imgRef && imgRef.current && imgRef.current.files[0]) {
      formData.append("multipartFile", imgRef.current.files[0]);
    }

    updateUser(formData, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        setCompleted(true);
      } else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const onChangeImage = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgUrl(reader.result);
    };
  }

  const onChangeJob = (e) => {
    setJob(e.target.value);
  }

  const onChangeIntro = (e) => {
    setIntro(e.target.value);
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.window}>
          <div className={styles.popup}>
            <div className={styles.close} >
              <div className={styles.headerText}>
                프로필을 수정해주세요.
              </div>
              <div className={styles.closeImage} onClick={close}>
                <img src={Close}/>
              </div>
            </div>
            <div className={styles.profile}>
              <div className={styles.profileImage} onClick={() => imgRef.current.click()}>
                <img id="profileImg" src={imgUrl} width='100px'/>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onChangeImage}
                    ref={imgRef}
                    style={{display:'none'}}/>
              </div>
              <div className={styles.username}>
                <input type="text" value={username} onChange={onChangeUsername} placeholder="username"/>
              </div>
              <div className={styles.job}>
                <select value={job} onChange={onChangeJob}>
                  <option value="">직군 선택</option>
                  {jobs.map((job, idx) => {
                    return <option key={idx} value={job.value}>{job.title}</option>
                  })}
                </select>
              </div>
              <div className={styles.intro}>
                <textarea className={styles.textArea} value={intro} onChange={onChangeIntro} placeholder="자기소개를 입력해주세요."/>
              </div>
            </div>
            <div className={styles.footer}>
              <button onClick={modifyUser}>수정하기</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default UpdateProfile;
