import styles from './signup.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  checkEmail,
  checkUsername,
  sendEmail,
  signupUser, verifyEmail
} from '../../apis/user';
import {jobs} from "../../utils/jobs";

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [job, setJob] = useState('')
  const [authNumber, setAuthNumber] = useState('')
  const [isPossibleEmail, setIsPossibleEmail] = useState(false)
  const [isPossibleUsername, setIsPossibleUsername] = useState(false)

  const emailChkDisable = useRef(null)
  const usernameChkDisable = useRef(null)
  const checkDisable = useRef(null)
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
      alertify.error("이메일 형식을 확인해주세요.", "1.2");
      return;
    }

    if (!validateUsername(username)) {
      alertify.error("닉네임 형식을 확인해주세요.", "1.2");
      return;
    }

    if (!validatePassword(password)) {
      alertify.error("패스워드 형식을 확인해주세요.", "1.2");
      return;
    }

    if (job === '') {
      alertify.error("직군을 선택해주세요.", "1.2");
      return;
    }

    signupUser(email, password, username, job)
    .then(res => {
      if (res.data.code === 1004) {
        alertify.error("이메일 or 닉네임이 중복되었습니다.", "1.2");
        return;
      }

      alertify.success("회원가입이 완료되었습니다.", "1.2");
      navigate('/');
    })
  }

  const checkDuplicatedUsername = () => {
    checkUsername(username)
    .then(res => {
      console.log(res)
      if (res.data.data.check) {
        alertify.success("확인되었습니다.", "1.2");
        setIsPossibleUsername(true);
        usernameChkDisable.current.classList.add(styles.disabled);
      } else {
        alertify.error("중복된 닉네임입니다.", "1.2");
        usernameChkDisable.current.classList.remove(styles.disabled);
      }
    })
  }

  const checkDuplicatedEmail = () => {
    // TODO add email verify
    // checkEmail(email)
    // .then(res => {
    //   console.log(res)
    //   if (res.data.data.check) {
    //     alert('확인되었습니다.');
    //     setIsPossibleEmail(true);
    //     emailChkDisable.current.classList.add(styles.disabled);
    //   } else {
    //     alert('중복된 이메일입니다.');
    //     emailChkDisable.current.classList.remove(styles.disabled);
    //   }
    // })
    sendEmail(email)
    .then(res => {
      alertify.success("이메일이 전송되었습니다. 인증번호를 입력해주세요.", "2");
      checkDisable.current.classList.remove(styles.hide);
    })
  }

  const checkEmailCheck = () => {
    verifyEmail(email, authNumber)
    .then(res => {
      if (res.data.data.success) {
        alertify.success("확인되었습니다.", "1.2");
        setIsPossibleEmail(true);
        emailChkDisable.current.classList.add(styles.disabled);
      }
    })
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    setIsPossibleEmail(false);
    emailChkDisable.current.classList.remove(styles.disabled);
  }

  const onChangeEmailCheck = (e) => {
    setAuthNumber(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setIsPossibleUsername(false);
    usernameChkDisable.current.classList.remove(styles.disabled);
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
            <button ref={emailChkDisable} className={styles.btn} onClick={checkDuplicatedEmail}>인증번호</button>
          </div>
          <div ref={checkDisable} className={`${styles.email} ${styles.hide}`}>
            <input type="text" onChange={onChangeEmailCheck} value={authNumber} placeholder={"인증번호"}/>
            <button className={styles.btn} onClick={checkEmailCheck}>확인</button>
          </div>
          <div className={styles.password}>
            <input type="password" onChange={onChangePassword} value={password} placeholder={"password"}/>
          </div>
          <div className={styles.username}>
            <input type="text" onChange={onChangeUsername} value={username} placeholder={"username"}/>
            <button ref={usernameChkDisable} className={styles.btn} onClick={checkDuplicatedUsername}>중복체크</button>
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
