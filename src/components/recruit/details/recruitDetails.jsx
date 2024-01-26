import styles from './recruitDetails.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../../states";
import {getPost} from "../../../apis/post";
import {getImg} from "../../../apis/awss3";
import {
  deleteComment,
  getComments,
  saveComment,
  updateComment
} from "../../../apis/comment";

const RecruitDetails = () => {
  const params = useParams();
  const postId = Number(params.postId)
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [imageUrl, setImageUrl] = useState('')

  const [comments, setComments] = useState([])
  const [updatingCommentId, setUpdatingCommentId] = useState(-1)
  const [updatedCommentContent, setUpdatedCommentContent] = useState('')
  const [commentContent, setCommentContent] = useState('')

  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    if (!accessToken) {
      alertify.error("로그인 후 이용해주세요.", "1.2");
      navigate('/login');
    }

    getPost(postId, accessToken, refreshToken)
    .then(res => {
      console.log(res.data)
      if (res.data.code === 4002) {
        alertify.error(res.data.message, "1.2");
        navigate('/');
      } else {
        setPost(res.data.data)
        if (res.data.data.imageUrl) {
          setImageUrl(getImg(res.data.data.imageUrl.replace(process.env.REACT_APP_S3_BUCKET_URL, "")))
        }
      }
    })

    getComments(postId, accessToken, refreshToken)
    .then((res) => {
      setComments(res.data.data.comments);
    })
  }, [])

  const registerComment = () => {
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

  const onChangeWritingCommentContent = (e) => {
    setCommentContent(e.target.value);
  }

  const onChangeUpdatingCommentContent = (e) => {
    setUpdatedCommentContent(e.target.value);
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>
            제목: {post && post.title}
          </div>
          <div className={styles.username}>
            작성자: {post && post.username}
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
              좋아요 수: {post && post.like}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          {/*TODO add jobLimits 직군별 모집 인원 list*/}
          {/*TODO add skills 기술 스택 list*/}
          {/*TODO add members 승인된 멤버 목록*/}
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
  )
}

export default RecruitDetails;
