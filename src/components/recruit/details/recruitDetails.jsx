import styles from './recruitDetails.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../../states";
import {getPost} from "../../../apis/post";
import {getImg} from "../../../apis/awss3";

const RecruitDetails = () => {
  const params = useParams();
  const postId = Number(params.postId)
  const navigate = useNavigate()

  const [imageUrl, setImageUrl] = useState('')

  // TODO add getImage
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    getPost(postId, accessToken, refreshToken)
    .then(res => {
      console.log(res.data)
      if (res.data.code === 4002) {
        alertify.error(res.data.message, "1.2");
        navigate('/');
      } else {
        if (res.data.data.imageUrl) {
          setImageUrl(getImg(res.data.data.imageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
        }
      }
    })
  }, [])

  return (
      <div className={styles.wrapper}>
        this is post detail page<br/>
        postId: {postId}<br/>
        <img src={imageUrl} width='100px'/><br/>
      </div>
  )
}

export default RecruitDetails;
