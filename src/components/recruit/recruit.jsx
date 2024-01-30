import styles from './recruit.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getPosts} from "../../apis/post";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../states";
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
  const [pages, setPages] = useState(1)
  const size = 10;

  const maxTitleLength = 15;

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    getPosts(type, skill, job, 1, size, accessToken, refreshToken)
    .then(res => {
      setPostList(res.data.data.postAllReadRes);
      setOffset(res.data.data.pageNumber);
      setPages(res.data.data.totalPage);
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

  const getHostProfile = (userId, username) => {
    return <a href={`/profile/${userId}`}>{username}</a>
  }

  const clickSearchBtn = (page) => {
    setOffset(page)
    getPosts(type, skill, job, page, size, accessToken, refreshToken)
    .then(res => {
      // TODO fix return null
      if (res.data.data) {
        setPostList(res.data.data.postAllReadRes);
        setPostList(res.data.data.postAllReadRes);
        setOffset(res.data.data.pageNumber);
        setPages(res.data.data.totalPage);
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

  const max = (x, y) => {
    if (x > y) return x;
    return y;
  }

  const min = (x, y) => {
    if (x < y) return x;
    return y;
  }

  const generateNumbers = () => {
    const numbers = [];
    const l = max(1, offset-4);
    const r = min(pages, offset+4);

    for (let i = l; i <= r; i++) {
      numbers.push(i);
    }

    return numbers;
  };

  return (
      <div className={styles.wrapper}>
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
          <button onClick={() => clickSearchBtn(1)}>검색</button>
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
                    <td className={styles.username}>{getHostProfile(post.userId, post.username)}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*TODO add page info*/}
        <div className={styles.pages}>
          <button className={styles.page} onClick={() => clickSearchBtn(1)}>첫 페이지</button>
          {generateNumbers().map((number, idx) => (
              <button
                  key={idx}
                  className={styles.page}
                  onClick={() => clickSearchBtn(number)}
                  style={number === offset? {fontWeight: 900}: {}}
              >
                {number}
              </button>
          ))}
          <button className={styles.page} onClick={() => clickSearchBtn(max(1, pages))}>마지막 페이지</button>
        </div>
        <div className={styles.btns}>
          <button className={styles.btn} onClick={goToPost}>모집글 작성</button>
        </div>
      </div>
  );
}

export default Recruit;
