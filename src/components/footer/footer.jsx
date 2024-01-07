import styles from './footer.module.scss'
import {Github} from "../../assets";

const Footer = () => {
  const teammate = [
    {
      "name": "장하람",
      "role": "리더",
      "github": "https://github.com/RyanDJang"
    },
    {
      "name": "강용수",
      "role": "부리더",
      "github": "https://github.com/emost22"
    },
    {
      "name": "이승준",
      "role": "팀원",
      "github": "https://github.com/lsj135779"
    },
    {
      "name": "지현구",
      "role": "팀원",
      "github": "https://github.com/jeendale"
    },
    {
      "name": "김동민",
      "role": "팀원",
      "github": "https://github.com/moonnnnnnn2541354"
    },
  ]

  const goToGithubPage = (url) => {
    window.open(url);
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.text}>
          Spring is coming.<br/>
          내일배움캠프 Spring 3기 봄이오조팀
        </div>
        <div className={styles.members}>
          {teammate.map((member, idx) => (
              <div className={styles.member} key={idx}>
                {member.name} ({member.role})<br/>
                <div className={styles.githubImage} onClick={() => goToGithubPage(member.github)}>
                  <img src={Github}/>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

export default Footer;