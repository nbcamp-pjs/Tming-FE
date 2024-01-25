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

const RecruitPost = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState(new Date())
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }
  }, [accessToken])

  const save = () => {
    const formData = new FormData();
    deadline.setHours(23, 59, 59, 999);
    // TODO add input job limits and skills
    const data = {
      title: title,
      content: content,
      deadline: deadline,
      jobLimits: [
        {
          job: "BACKEND",
          headcount: 1,
        }
      ],
      skills: ["JAVA"]
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    formData.append("request", blob);
    formData.append("image", imgRef.current.files[0]);

    savePost(formData, accessToken, refreshToken)
    .then(res => {
      console.log(res)
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
