import styles from './member.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {Close, LoopyGoonchim} from "../../../../assets";
import {jobs} from "../../../../utils/jobs";
import {useEffect, useState} from "react";
import {getImg} from "../../../../apis/awss3";
import {getApplicants} from "../../../../apis/applicant";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState} from "../../../../states";
import {saveMember} from "../../../../apis/member";

const Member = (props) => {
  const {postId, isOpen, close} = props;
  const [applicants, setApplicants] = useState([])
  const [imgUrls, setImgUrls] = useState([])

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    getApplicants(postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        if (!res.data.data.applicants || !res.data.data.applicants.length) {
          alertify.error("신청한 유저가 없습니다.", "1.2");
          close();
        }

        const newArr = []
        res.data.data.applicants.map((applicant, idx) => {
          if (applicant && applicant.profileImageUrl) {
            newArr.push(getImg(applicant.profileImageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
          }
          else {
            newArr.push(LoopyGoonchim);
          }
        })
        setApplicants(res.data.data.applicants);
        setImgUrls(() => newArr);
      } else {
        alertify.error(res.data.message, "1.2");
        close();
      }
    })
  }, [])

  const applyMember = (userId, job) => {
    jobs.map((j, idx) => {
      if (j.title === job) {
        job = j.value;
      }
    })

    saveMember(userId, postId, job, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success("승인되었습니다.", "1.2");
        window.location.reload();
      }
      else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const getMemberList = () => {
    return <>
      {applicants && applicants.map((applicant, idx) => (
          <div key={idx} className={styles.member}>
            <div className={styles.memberInfo}>
              <img src={imgUrls[idx]} width='30px'/>
              <div className={styles.userinfo}>
                {applicant.username} | {applicant.job}
              </div>
            </div>
            <button onClick={() => applyMember(applicant.userId, applicant.job)}>승인하기</button>
          </div>
      ))}
    </>
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.window}>
          <div className={styles.popup}>
            <div className={styles.close}>
              <div className={styles.headerText}>
                승인할 유저를 선택해주세요.
              </div>
              <div className={styles.image} onClick={close}>
                <img src={Close}/>
              </div>
            </div>
            <div className={styles.members}>
              {getMemberList()}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Member;
