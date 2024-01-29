import styles from './recruitPost.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {savePost} from "../../../apis/post";
import {accessTokenState, refreshTokenState} from "../../../states";
import {useNavigate} from "react-router-dom";
import {jobs} from "../../../utils/jobs";
import {skills} from "../../../utils/skills";

const RecruitPost = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState(new Date())
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  const [headcounts, setHeadcounts] = useState(Array(14).fill(0))
  const [checkedSkills, setCheckedSkills] = useState(new Set())

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }
  }, [accessToken])

  const save = () => {
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
      title: title,
      content: content,
      deadline: deadline,
      jobLimits: jobLimits,
      skills: Array.from(checkedSkills)
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("request", blob);
    formData.append("image", imgRef.current.files[0]);

    savePost(formData, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 4007) {
        alertify.error(res.data.message, "1.2");
      } else if (res.data.code === 4008) {
        alertify.error(res.data.message, "1.2");
      } else {
        alertify.success("모집글이 저장되었습니다.", "1.2");
        navigate('/');
      }
    })
    .catch(err => {
      console.error(err);
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

  const checkedSkillHandler = (skill) => (e) => {
    if (e.target.checked) {
      checkedSkills.add(skill);
      setCheckedSkills(checkedSkills);
    } else if (!e.target.checked && checkedSkills.has(skill)) {
      checkedSkills.delete(skill);
      setCheckedSkills(checkedSkills);
    }
  }

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  return (
      <div className={styles.wrapper}>
        <div className={styles.inputs}>
          <div className={styles.title}>
            <input type="text" value={title} onChange={onChangeTitle} placeholder="모집글 제목을 작성해주세요."/>
          </div>
          <div className={styles.content}>
            <input type="text" value={content} onChange={onChangeContent} placeholder="모집글 내용을 작성해주세요."/>
          </div>
          <div className={styles.deadline}>
            <DatePicker
                dateFormat="yyyy-MM-dd"
                selected={deadline}
                onChange={date => setDeadline(date)}
                minDate={new Date()}/>
          </div>
          <div>
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
                  <label><input type="checkbox" onChange={checkedSkillHandler(skill.value)}/> {skill.title}</label>
                </div>
            ))}
          </div>
          <input
              type="file"
              accept="image/*"
              id="profileImg"
              onChange={saveImgFile}
              ref={imgRef}
          />
          <div>
            <button onClick={save}>작성</button>
          </div>
        </div>
      </div>
  );
}

export default RecruitPost;
