import styles from './recruit.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getPosts} from "../../apis/post";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../states";
import {getImg} from "../../apis/awss3";
import {jobs} from "../../utils/jobs";
import {skills} from "../../utils/skills";
import {types} from "../../utils/types";

const Recruit = () => {
  const navigate = useNavigate()
  const [postList, setPostList] = useState([])

  const [type, setType] = useState('')
  const [skill, setSkill] = useState('')
  const [job, setJob] = useState('')
  const [offset, setOffset] = useState(1)
  const [size, setSize] = useState(10)

  const maxTitleLength = 15;

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    getPosts(type, skill, job, accessToken, refreshToken)
    .then(res => {
      setPostList(res.data.data.postAllReadRes);
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

  const clickSearchBtn = () => {
    console.log(type, skill, job)
    getPosts(type, skill, job, accessToken, refreshToken)
    .then(res => {
      // TODO fix return null
      console.log(res.data.data)
      if (res.data.data) {
        setPostList(res.data.data.postAllReadRes);
      }
    })
    .catch(err => {
      console.error(err)
    })
  }

  const onChangeType = (e) => {
    setType(e.target.value);
  }

  const onChangeSkill = (e) => {
    setSkill(e.target.value);
  }

  const onChangeJob = (e) => {
    setJob(e.target.value);
  }

  return (
      <div className={styles.wrapper}>
        <h1>아 프론트 하기 싫다</h1>
        <div className={styles.filtering}>
          <div className={styles.type}>
            <select value={type} onChange={onChangeType}>
              <option value="">타입 선택</option>
              {types.map((type, idx) => {
                return <option key={idx} value={type.value}>{type.title}</option>
              })}
            </select>
          </div>
          <div className={styles.skill}>
            <select value={skill} onChange={onChangeSkill}>
              <option value="">기술 선택</option>
              {skills.map((skill, idx) => {
                return <option key={idx} value={skill.value}>{skill.title}</option>
              })}
            </select>
          </div>
          <div className={styles.job}>
            <select value={job} onChange={onChangeJob}>
              <option value="">직군 선택</option>
              {jobs.map((job, idx) => {
                return <option key={idx} value={job.value}>{job.title}</option>
              })}
            </select>
          </div>
          <button onClick={clickSearchBtn}>검색</button>
        </div>
        <div className={styles.postList}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.postTitle}>
                <th className={styles.postIdTitle}>번호</th>
                <th className={styles.titleTitle}>제목</th>
                <th className={styles.deadlineTitle}>마감일</th>
                <th className={styles.statusTitle}>상태</th>
                <th className={styles.usernameTitle}>작성자</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {postList && postList.map((post, idx) => (
                  <tr key={idx} className={styles.post}>
                    <td className={styles.postId}>{post.postId}</td>
                    <td className={styles.title}>{getPostLink(post.postId, post.title)}</td>
                    <td className={styles.deadline}>{post.deadline}</td>
                    <td className={styles.status}>{post.status}</td>
                    <td className={styles.username}>{post.username}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*TODO add page info*/}
        <div className={styles.btns}>
          <button className={styles.btn} onClick={goToPost}>모집글 작성</button>
        </div>
      </div>
  );
}

export default Recruit;
