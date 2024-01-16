import styles from './signup.module.scss';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {signupUser} from '../../apis/user';
import {jobs} from "../../utils/jobs";

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [job, setJob] = useState('')
  const [isPossibleEmail, setIsPossibleEmail] = useState(false)
  const [isPossibleUsername, setIsPossibleUsername] = useState(false)

  const btnDisable = useRef(null)

  const navigate = useNavigate()
  const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const usernameRegex = /^[a-zA-Z0-9가-힣]{4,12}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,16}$/;

  useEffect(() => {
    if (isPossibleEmail && isPossibleUsername) {
      btnDisable.current.classList.remove(styles.disabled);
    } else {
      btnDisable.current.classList.add(styles.disabled);
    }
  }, [isPossibleEmail, isPossibleUsername])

  const validateEmail = (email) => {
    return emailRegex.test(email);
  }

  const validateUsername = (username) => {
    return usernameRegex.test(username);
  }

  const validatePassword = (password) => {
    return passwordRegex.test(password);
  }

  const signup = () => {
    if (!validateEmail(email)) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }

    if (!validateUsername(username)) {
      alert('닉네임 형식을 확인해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      alert('패스워드 형식을 확인해주세요.');
      return;
    }

    if (job === '') {
      alert('직군을 선택해주세요.');
      return;
    }

    signupUser(email, password, username, job)
    .then(res => {
      if (res.data.code === 1004) {
        alert('이메일 or 닉네임이 중복되었습니다.')
        return;
      }

      console.log(res)
      alert('회원가입이 완료되었습니다.');
      navigate('/');
    })
  }

  const checkDuplicatedUsername = () => {
    console.log(username)
    setIsPossibleUsername(true);
  }

  const checkDuplicatedEmail = () => {
    console.log(email)
    setIsPossibleEmail(true);
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    setIsPossibleEmail(false);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setIsPossibleUsername(false);
  }

  const onChangeJob = (e) => {
    setJob(e.target.value);
  }

  // TODO add verify email btn
  return (
      <div className={styles.wrapper}>
        <div className={styles.inputs}>
          <div className={styles.email}>
            <input type="text" onChange={onChangeEmail} value={email} placeholder={"email"}/>
            <button className={styles.btn} onClick={checkDuplicatedEmail}>중복체크</button>
          </div>
          <div className={styles.password}>
            <input type="password" onChange={onChangePassword} value={password} placeholder={"password"}/>
          </div>
          <div className={styles.username}>
            <input type="text" onChange={onChangeUsername} value={username} placeholder={"username"}/>
            <button className={styles.btn} onClick={checkDuplicatedUsername}>중복체크</button>
          </div>
          <div className={styles.job}>
            <select value={job} onChange={onChangeJob}>
              <option value="">직군 선택</option>
              {jobs.map((job, idx) => {
                return <option key={idx} value={job.value}>{job.title}</option>
              })}
            </select>
          </div>
          <div className={styles.btns}>
            <button ref={btnDisable} className={`${styles.btn} ${styles.disabled}}`} onClick={signup} disabled={!isPossibleEmail || !isPossibleUsername}>회원가입</button>
          </div>
        </div>
      </div>
  )
}

export default Signup;
