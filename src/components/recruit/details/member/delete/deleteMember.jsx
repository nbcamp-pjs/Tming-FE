import styles from './deleteMember.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {Close} from "../../../../../assets";
import {useEffect, useState} from "react";
import {getImg} from "../../../../../apis/awss3";
import {useRecoilValue} from "recoil";
import {accessTokenState, refreshTokenState} from "../../../../../states";
import {deleteMember} from "../../../../../apis/member";

const DeleteMember = (props) => {
  const {postId, members, isOpen, close} = props;
  const [imgUrls, setImgUrls] = useState([])

  const accessToken = useRecoilValue(accessTokenState)
  const refreshToken = useRecoilValue(refreshTokenState)

  useEffect(() => {
    if (!members || !members.length) {
      alertify.error("현재 등록된 팀원이 없습니다.");
      close();
    }

    const newArr = []
    members.map((member, idx) => {
      if (member && member.profileImageUrl) {
        newArr.push(getImg(member.profileImageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
      }
      else {
        newArr.push(getImg("test/loopy-goonchim.png"));
      }
    })
    setImgUrls(() => newArr);
  }, [])

  const delMember = (userId) => {
    deleteMember(userId, postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success('팀원이 삭제되었습니다.', "1.2");
        window.location.reload();
      } else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const getMemberList = () => {
    return <>
      {members && members.map((member, idx) => (
          <div key={idx} className={styles.member}>
            <div className={styles.memberInfo}>
              <img src={imgUrls[idx]} width='30px'/>
              <div className={styles.userinfo}>
                {member.username} | {member.job}
              </div>
            </div>
            <button onClick={() => delMember(member.userId)}>방출하기</button>
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
                방출할 팀원들 선택해주세요.
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

export default DeleteMember;
