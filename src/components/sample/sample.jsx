import styles from './sample.module.scss';
import {useEffect, useState} from "react";
import {getAllSamples, insertSample} from '../../apis/sample';
import {getFollowers, getFollowings, getUserProfile} from "../../apis/user";
import {useRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";

const Sample = () => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [samples, setSamples] = useState([])
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  useEffect(() => {
    getAllSamples(accessToken, refreshToken)
    .then(res => {
      setSamples(res.data.data.sampleGetReses);
    });
  }, [])

  const saveSample = () => {
    insertSample(title, text, accessToken, refreshToken)
    .then(res => {
      window.location.reload();
    })
    .finally(() => {
      setTitle('');
      setText('');
    });
  }

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  }

  const onChangeText = (e) => {
    setText(e.target.value);
  }

  return (
      <div className={styles.wrapper}>
        {samples.map((sample, idx) => (
            <div key={idx}>
              {idx + 1}: {sample.title}, {sample.text}
            </div>
        ))}
        <input type="text" onChange={onChangeTitle} value={title}/><br/>
        <input type="text" onChange={onChangeText} value={text}/><br/>
        <button onClick={saveSample}>save</button>
      </div>
  );
}

export default Sample;
