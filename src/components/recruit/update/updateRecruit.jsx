import styles from './updateRecruit.module.scss';
import {Close} from "../../../assets";
import {useEffect, useRef, useState} from "react";
import {getImg} from "../../../apis/awss3";
import DatePicker from "react-datepicker";
import {jobs} from "../../../utils/jobs";
import {skills} from "../../../utils/skills";
import alertify from "alertifyjs";
import {updatePost} from "../../../apis/post";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../../states";

const UpdateRecruit = (props) => {
  const {post, close} = props;
  const [imgUrl, setImgUrl] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState(new Date())

  const updateImgRef = useRef(null)
  const [headcounts, setHeadcounts] = useState(Array(14).fill(0))
  const [checkedSkills, setCheckedSkills] = useState(new Set())
  const [isSelected, setIsSelected] = useState(Array(15).fill(false))

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (post.imageUrl) {
      const url = post.imageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "");
      setImgUrl(getImg(url))
    }

    setTitle(post.title);
    setContent(post.content);
    setDeadline(new Date(post.deadline));

    post.jobLimits.map((jobLimit, idx) => {
      jobs.map((job, idx2) => {
        if (job.title === jobLimit.job) {
          setHeadcounts(prev => {
            prev[idx2] = jobLimit.headcount;
            return [...prev]
          })
        }
      })
    })

    post.skills.map((skill, idx) => {
      skills.map((sk, idx2) => {
        if (sk.title === skill) {
          checkedSkills.add(sk.value);
          setCheckedSkills(() => checkedSkills);
          setIsSelected(prev => {
            prev[idx2] = true
            return [...prev]
          })
        }
      })
    })
  }, [])

  const modifyPost = () => {
    if (!title.trim().length || title.length > 30) {
      alertify.error("게시글 제목은 30글자 이내로 작성해주세요.", "1.2");
      return;
    }

    if (!content.trim().length || content.length > 1500) {
      alertify.error("게시글 내용은 1500글자 이내로 작성해주세요.", "1.2");
      return;
    }

    const jobLimits = []
    headcounts.map((headcount, idx) => {
      if (headcount) {
        jobLimits.push({
          job: jobs[idx].value,
          headcount: headcount
        })
      }
    })

    if (!jobLimits.length) {
      alertify.error("최소 하나의 직군을 선택해주세요.", "1.2");
      return;
    }

    if (!checkedSkills.size) {
      alertify.error("최소 하나의 기술스택을 선택해주세요.", "1.2");
      return;
    }

    const formData = new FormData();
    deadline.setHours(23, 59, 59, 999);
    const data = {
      postId: post.postId,
      title: title,
      content: content,
      deadline: deadline,
      jobLimits: jobLimits,
      skills: Array.from(checkedSkills),
      imageUrl: post.imageUrl
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("request", blob);
    if (updateImgRef && updateImgRef.current && updateImgRef.current.files[0]) {
      formData.append("image", updateImgRef.current.files[0]);
    }

    updatePost(formData, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success("모집글이 수정되었습니다.", "1.2");
        close();
        window.location.reload();
      } else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  }

  const onChangeContent = (e) => {
    setContent(e.target.value);
  }

  const onChangeJobLimit = (idx) => (e) => {
    setHeadcounts(prev => {
      prev[idx] = e.target.value
      return [...prev]
    })
  }

  const checkedSkillHandler = (idx, skill) => (e) => {
    if (e.target.checked) {
      checkedSkills.add(skill);
      setIsSelected(prev => {
        prev[idx] = !prev[idx]
        return [...prev]
      })
      setCheckedSkills(() => checkedSkills);
    } else if (!e.target.checked && checkedSkills.has(skill)) {
      checkedSkills.delete(skill);
      setIsSelected(prev => {
        prev[idx] = !prev[idx]
        return [...prev]
      })
      setCheckedSkills(() => checkedSkills);
    }
  }

  const onChangeImage = () => {
    const file = updateImgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgUrl(reader.result);
    };
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.window}>
          <div className={styles.popup}>
            <div className={styles.close} >
              <div className={styles.headerText}>
                게시글을 수정해주세요.
              </div>
              <div className={styles.closeImage} onClick={close}>
                <img src={Close}/>
              </div>
            </div>
            <div className={styles.post}>
              <div className={styles.postTitle}>
                <input type="text" value={title} onChange={onChangeTitle}/>
              </div>
              <div className={styles.postContent}>
                <textarea className={styles.textArea} value={content} onChange={onChangeContent} placeholder="댓글을 작성해주세요."/>
              </div>
              <div className={styles.postDeadline}>
                <DatePicker
                    dateFormat="yyyy-MM-dd"
                    selected={deadline}
                    onChange={date => setDeadline(date)}
                    minDate={new Date()}/>
              </div>
              <div className={styles.jobs}>
                직군별 모집 인원을 작성하세요.
                {jobs.map((job, idx) => (
                    <div key={idx}>
                      {job.title}: <input type="text" value={headcounts[idx]} onChange={onChangeJobLimit(idx)} />
                    </div>
                ))}
              </div>
              <hr style={{width: '100%'}}/>
              <div>
                기술 스택을 선택해주세요.
                {skills.map((skill, idx) => (
                    <div key={idx}>
                      <label>
                        <input type="checkbox" onChange={checkedSkillHandler(idx, skill.value)} checked={isSelected[idx]}/> {skill.title}
                      </label>
                    </div>
                ))}
              </div>
              <div className={styles.postImage} onClick={() => updateImgRef.current.click()}>
                <img src={imgUrl} width='100px'/>
                <input
                    id="profileImg"
                    type="file"
                    accept="image/*"
                    onChange={onChangeImage}
                    ref={updateImgRef}
                    style={{display:'none'}}/>
              </div>
            </div>
            <div className={styles.footer}>
              <button onClick={modifyPost}>수정하기</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default UpdateRecruit;
