import styles from './applicant.module.scss';
import {useRecoilState} from "recoil";
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {accessTokenState, refreshTokenState} from "../../../../states";
import {useState} from "react";
import {Close} from "../../../../assets";
import {jobs} from "../../../../utils/jobs";
import {saveApplicant} from "../../../../apis/applicant";

const Applicant = (props) => {
  const {postId, jobLimits, isOpen, close} = props;
  const [job, setJob] = useState('')

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  const onChangeJob = (e) => {
    setJob(e.target.value);
  }

  const applyTeam = () => {
    saveApplicant(postId, job, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success("신청이 완료되었습니다.", "1.2");
        close();
      } else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.window}>
          <div className={styles.popup}>
            <div className={styles.close} >
              <div className={styles.headerText}>
                신청할 직군을 선택해주세요.
              </div>
              <div className={styles.image} onClick={close}>
                <img src={Close}/>
              </div>
            </div>
            <div className={styles.job}>
              <select value={job} onChange={onChangeJob}>
                <option value="">직군 선택</option>
                {jobs.map((job, idx) => {
                  return <option key={idx} value={job.value}>{job.title}</option>
                })}
              </select>
            </div>
            <div className={styles.footer}>
              <button onClick={applyTeam}>신청하기</button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Applicant;
