import styles from './recruitDetails.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../../states";
import {
  deletePost,
  getPost,
  likePost,
  unlikePost,
  updatePostStatus
} from "../../../apis/post";
import {getImg} from "../../../apis/awss3";
import {
  deleteComment,
  getComments,
  saveComment,
  updateComment
} from "../../../apis/comment";
import Applicant from "./applicant/applicant";
import Member from "./member/member";
import {deleteApplicant} from "../../../apis/applicant";
import DeleteMember from "./member/delete/deleteMember";
import UpdateRecruit from "../update/updateRecruit";

const RecruitDetails = () => {
  const params = useParams();
  const postId = Number(params.postId)
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [memberImgUrls, setMemberImgUrls] = useState([])

  const [comments, setComments] = useState([])
  const [updatingCommentId, setUpdatingCommentId] = useState(-1)
  const [updatedCommentContent, setUpdatedCommentContent] = useState('')
  const [commentContent, setCommentContent] = useState('')

  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  const [isOpenApplicantModal, setIsOpenApplicantModal] = useState(false)
  const [isOpenMemberModal, setIsOpenMemberModal] = useState(false)
  const [isOpenDelMemberModal, setIsOpenDelMemberModal] = useState(false)

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    getPost(postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 4002) {
        alertify.error(res.data.message, "1.2");
        navigate('/');
      } else {
        setPost(res.data.data)
        if (res.data.data.imageUrl) {
          setImageUrl(getImg(res.data.data.imageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
        }

        const newArr = []
        res.data.data.members.map((member, idx) => {
          if (member && member.profileImageUrl) {
            newArr.push(getImg(member.profileImageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
          }
          else {
            newArr.push(getImg("test/loopy-goonchim.png"));
          }
        })
        setMemberImgUrls(() => newArr);
      }
    })

    getComments(postId, accessToken, refreshToken)
    .then((res) => {
      setComments(res.data.data.comments);
    })
  }, [])

  const closeIsUpdating = () => {
    setIsUpdating(false);
  }

  const modifyPost = () => {
    setIsUpdating(true);
  }

  const modifyPostBtn = () => {
    return <button onClick={modifyPost}>모집글 수정</button>
  }

  const delPost = () => {
    deletePost(postId, accessToken, refreshToken)
    .then(res => {
      if(res.data.code === 0) {
        alertify.success("삭제되었습니다.", "1.2");
        navigate('/');
      }
      else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const delPostBtn = () => {
    return <button onClick={delPost}>모집글 삭제</button>
  }

  const getProfilePage = (userId) => {
    navigate('/profile/' + userId);
  }

  const registerComment = () => {
    if (commentContent.trim() === '') {
      alertify.error("댓글 내용을 작성해주세요.", "1.2");
      return;
    }

    saveComment(postId, commentContent, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success("댓글이 작성되었습니다.", "1.2");
        setCommentContent('')
        window.location.reload();
      } else {
        alertify.error("알 수 없는 에러가 발생했습니다.<br/>다시 시도해주세요.", "1.2");
      }
    })
  }

  const modifyComment = (idx, commentId, content) => {
    if (updatingCommentId === commentId) {
      if (updatedCommentContent.trim() === '') {
        alertify.error("댓글 내용을 작성해주세요.", "1.2");
        return;
      }

      updateComment(commentId, updatedCommentContent, accessToken, refreshToken)
      .then(res => {
        if (res.data.code === 0) {
          alertify.success("댓글이 수정되었습니다.", "1.2");
          setUpdatedCommentContent('');
          setUpdatingCommentId(-1);
          window.location.reload();
        } else {
          alertify.error("알 수 없는 에러가 발생했습니다.<br/>다시 시도해주세요.", "1.2");
        }
      })
    } else {
      setUpdatingCommentId(commentId);
      setUpdatedCommentContent(content);
    }
  }

  const delComment = (commentId) => {
    deleteComment(commentId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success("댓글이 삭제되었습니다.", "1.2");
        window.location.reload();
      } else {
        alertify.error("알 수 없는 에러가 발생했습니다.<br/>다시 시도해주세요.", "1.2");
      }
    })
  }

  const getBtns = (idx, commentId, content) => {
    return <div>
      <button onClick={() => modifyComment(idx, commentId, content)}>수정</button>
      <button onClick={() => delComment(commentId)}>삭제</button>
    </div>
  }

  const pushLike = () => {
    likePost(postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success(res.data.message, "1.2");
        window.location.reload();
      }
      else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const pushUnlike = () => {
    unlikePost(postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success(res.data.message, "1.2");
        window.location.reload();
      }
      else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }

  const getLikeBtn = () => {
    return <button onClick={pushLike}>좋아요</button>
  }

  const getUnlikeBtn = () => {
    return <button onClick={pushUnlike}>좋아요 취소</button>
  }

  const modifyPostStatus = (status) => {
    updatePostStatus(postId, status, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success(res.data.message, "1.2");
        window.location.reload();
      }
      else {
        alertify.error(res.data.message, "1.2");
      }
    })
  }
  
  const getRecruited = () => {
    return <button onClick={() => modifyPostStatus("CLOSED")}>모집 완료</button>
  }
  
  const getRecruiting = () => {
    return <button onClick={() => modifyPostStatus("OPEN")}>모집 완료 취소</button>
  }

  const onChangeWritingCommentContent = (e) => {
    setCommentContent(e.target.value);
  }

  const onChangeUpdatingCommentContent = (e) => {
    setUpdatedCommentContent(e.target.value);
  }

  const pushApplicantBtn = () => {
    setIsOpenApplicantModal(true);
  }

  const cancelApplicant = () => {
    deleteApplicant(postId, accessToken, refreshToken)
    .then(res => {
      if (res.data.code === 0) {
        alertify.success('신청이 삭제되었습니다.', '1.2');
        window.location.reload();
      } else {
        alertify.error(res.data.message, '1.2');
      }
    })
  }

  const pushMemberBtn = () => {
    setIsOpenMemberModal(true);
  }

  const delMember = () => {
    setIsOpenDelMemberModal(true);
  }

  const delMemberBtn = () => {
    return <button onClick={delMember}>멤버 방출</button>
  }

  const closeApplicantModal = () => {
    setIsOpenApplicantModal(false)
  }

  const closeMemberModal = () => {
    setIsOpenMemberModal(false)
  }

  const closeDelMemberModal = () => {
    setIsOpenDelMemberModal(false)
  }

  const getApplicantBtn = () => {
    if (post && post.approval) {
      return;
    }

    if (!post || !post.applicantId) {
      return <button onClick={pushApplicantBtn}>신청하기</button>
    }

    return <button onClick={cancelApplicant}>신청 취소하기</button>
  }

  const getMemberBtn = () => {
    return <button onClick={pushMemberBtn}>신청목록</button>
  }

  const getHostProfile = (userId, username) => {
    return <a href={`/profile/${userId}`}>{username}</a>
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.realWrapper}>
          <div className={styles.header}>
            <div className={styles.title}>
              제목: {post && post.title}
            </div>
            <div className={styles.username}>
              작성자: {post && getHostProfile(post.userId, post.username)}
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.content}>
              <pre>{post && post.content}</pre>
              <div className={styles.image}>
                <img src={imageUrl}/><br/>
              </div>
            </div>
            <div className={styles.etc}>
              <div className={styles.visit}>
                조회수: {post && post.visit}
              </div>
              <div>
                마감일: {post && post.deadline}
              </div>
              <div className={styles.status}>
                {post && post.status}
              </div>
              <div>
                좋아요: {post && post.like}
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.jobLimits}>
              모집 인원
              {post && post.jobLimits.map((jobLimit, idx) => (
                  <div key={idx} className={styles.jobLimit}>
                    {jobLimit.job}: {jobLimit.headcount}명
                  </div>
              ))}
            </div>
            <div className={styles.skills}>
              기술 스택
              {post && post.skills.map((skill, idx) => (
                  <div key={idx} className={styles.skill}>
                    {skill}
                  </div>
              ))}
            </div>
            <div className={styles.members}>
              <div className={styles.memberText}>
                모집된 인원
              </div>
              <div className={styles.memberInfo}>
                {post && post.members.length? post.members.map((member, idx) => (
                    <div key={idx} className={styles.member} onClick={() => getProfilePage(member.userId)}>
                      <img src={memberImgUrls[idx]} width='30px'/>
                    </div>
                )): "없음"}
              </div>
            </div>
          </div>
          <div className={styles.applyArea}>
            {(post && user && user.username === post.username) && (post.status === "모집중"? getRecruited(): getRecruiting())}
            {post && !post.liked? getLikeBtn(): getUnlikeBtn()}
            {isOpenApplicantModal && <Applicant postId={postId} jobLimits={post.jobLimits} isOpen={isOpenApplicantModal} close={closeApplicantModal}/>}
            {isOpenMemberModal && <Member postId={postId} isOpen={isOpenMemberModal} close={closeMemberModal}/>}
            {isOpenDelMemberModal && <DeleteMember postId={postId} members={post.members} isOpen={isOpenDelMemberModal} close={closeDelMemberModal} />}
            {isUpdating && <UpdateRecruit post={post} close={closeIsUpdating}/>}
            {(post && user && post.status === "모집중") && (user.username !== post.username? getApplicantBtn(): getMemberBtn())}
            {post && user && user.username === post.username && delMemberBtn()}
            {post && user && user.username === post.username && modifyPostBtn()}
            {post && user && user.username === post.username && delPostBtn()}
          </div>
          <div className={styles.commentArea}>
            <div className={styles.inputComment}>
              <textarea className={styles.textArea} value={commentContent} onChange={onChangeWritingCommentContent} placeholder={"댓글을 작성해주세요."}/>
              <div className={styles.saveCommentBtn}>
                <button onClick={registerComment}>등록</button>
              </div>
            </div>
            {comments && comments.map((comment, idx) => (
                <div key={idx} className={styles.comment}>
                  {idx !== 0 && <hr className={styles.hr}/>}
                  <div className={styles.commentHeader}>
                    <div className={styles.commentUsername}>
                      {comment.username}
                    </div>
                    <div className={styles.commentCreateTimestamp}>
                      {comment.createTimestamp}
                    </div>
                  </div>
                  <div className={styles.commentBody}>
                  <pre>
                    {updatingCommentId !== comment.commentId? comment.content: <textarea className={styles.updatingTextArea} value={updatedCommentContent} onChange={onChangeUpdatingCommentContent}></textarea>}
                  </pre>
                  </div>
                  <div className={styles.commentFooter}>
                    {comment.username === user.username && getBtns(idx, comment.commentId, comment.content)}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default RecruitDetails;
