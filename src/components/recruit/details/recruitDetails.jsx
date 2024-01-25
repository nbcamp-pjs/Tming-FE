import styles from './recruitDetails.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../../states";
import {getPost} from "../../../apis/post";

const RecruitDetails = () => {
  const params = useParams();
  const postId = Number(params.postId)
  const navigate = useNavigate()

  // TODO add getImage
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    // getPost()
  }, [])

  return (
      <div className={styles.wrapper}>
        this is post detail page<br/>
        postId: {postId}
      </div>
  )
}

export default RecruitDetails;
