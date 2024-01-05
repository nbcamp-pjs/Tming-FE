import styles from './header.module.scss'
import {TmingLogo} from "../../assets";

const Header = () => {
  const clickLogo = () => {
    console.log('logo click');
  }

  return (
      <div>
        <div className={styles.wrapper}>
          <img src={TmingLogo} alt="Tming Logo" style={{cursor: 'pointer'}} onClick={clickLogo}/>
          <div className={styles.navWrapper}>
            <div className={styles.navItem}>header1</div>
            <div className={styles.navItem}>header2</div>
            <div className={styles.navItem}>header3</div>
          </div>
        </div>
      </div>
  );
}

export default Header;