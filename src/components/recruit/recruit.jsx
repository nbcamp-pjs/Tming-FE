import styles from './recruit.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getPosts} from "../../apis/post";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../states";
import {getImg} from "../../apis/awss3";

const Recruit = () => {
  const navigate = useNavigate()
  const [postList, setPostList] = useState([])
  const [type, setType] = useState('ALL')
  const [skill, setSkill] = useState(null)
  const [job, setJob] = useState(null)
  const maxTitleLength = 3;

  const [imageUrl, setImageUrl] = useState(null)

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("skill", skill);
    formData.append("job", job);

    console.log(accessToken)
    console.log(refreshToken)
    getPosts(type, skill, job, accessToken, refreshToken)
    .then(res => {
      console.log(res.data.data)
      setPostList(res.data.data.postAllReadRes);
      // setImageUrl(getImg(res.data.data.postAllReadRes[0].imageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
    })
    .catch(err => {
      console.error(err)
    })
  }, [])

  const goToPost = () => {
    navigate('/post');
  }

  const getShortTitle = (title) => {
    if (title.length > maxTitleLength) {
      return title.slice(0, maxTitleLength) + "...";
    }
    return title;
  }

  const getPostLink = (postId, title) => {
    return <a href={`/post/${postId}`}>{getShortTitle(title)}</a>
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.postList}>
          <table>
            {postList && postList.map((post, idx) => (
                // TODO fix table
              <div key={idx} className={styles.post}>
                <div className={styles.postId}>
                  {post.postId}
                </div>
                <div className={styles.title}>
                  {getPostLink(post.postId, post.title)}
                </div>
                <div className={styles.deadline}>
                  {post.deadline}
                </div>
                <div className={styles.status}>
                  {post.status}
                </div>
                <div className={styles.username}>
                  {post.username}
                </div>
              </div>
            ))}
          </table>
        </div>
        <div className={styles.btns}>
          <button className={styles.btn} onClick={goToPost}>모집글 작성</button>
        </div>
      </div>
  );
}

export default Recruit;
