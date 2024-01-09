import styles from './home.module.scss'
import {useEffect, useState} from "react";
import {getImg} from "../../apis/awss3";

const Home = () => {
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    setImgUrl(getImg("test/loopy-goonchim.png"));
  }, [])

  return (
      <div className={styles.wrapper}>
        This is home page<br/>
        <img src={imgUrl} width='100px'/><br/>
      </div>
  );
}

export default Home;
