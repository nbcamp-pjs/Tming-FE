import styles from './recruitDetails.module.scss';
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {useParams} from "react-router-dom";
import {useEffect} from "react";

const RecruitDetails = () => {
  const params = useParams();
  const postId = Number(params.postId)

  useEffect(() => {
    console.log(postId)
  }, [])

  return (
      <div className={styles.wrapper}>
        this is post detail page<br/>
        postId: {postId}
      </div>
  )
}

export default RecruitDetails;
