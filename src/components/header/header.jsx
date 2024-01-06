import styles from './header.module.scss'
import {TmingLogo} from "../../assets";
import {Link, useLocation, useNavigate} from "react-router-dom";

const Header = () => {
  const navItems = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'Recruit',
      path: '/recruit',
    },
    {
      title: 'Sample',
      path: '/sample',
    },
  ]

  const {pathname} = useLocation()
  const navigate = useNavigate()

  const isCurrentPage = (headerPath) => {
    return '/' + pathname.split('/')[1] === headerPath
  }

  const clickLogo = () => {
    navigate('/')
  }

  return (
      <div>
        <div className={styles.wrapper}>
          <img src={TmingLogo} alt="Tming Logo" style={{cursor: 'pointer'}} onClick={clickLogo}/>
          <div className={styles.navWrapper}>
            {navItems.map((navItem, index) => (
                <Link to={navItem.path} key={index} target={navItem.target}
                      className={`${styles.navItem} ${isCurrentPage(navItem.path) ? styles.current : ''}`}>
                  {navItem.title}
                </Link>
            ))}
          </div>
        </div>
      </div>
  );
}

export default Header;