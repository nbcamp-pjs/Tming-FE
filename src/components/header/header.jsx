import styles from './header.module.scss'
import {TmingLogo} from "../../assets";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {logoutUser} from "../../apis/user";

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

  const login = {
      title: 'Login',
      path: '/login'
    }

  const {pathname} = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState)

  const isCurrentPage = (headerPath) => {
    return '/' + pathname.split('/')[1] === headerPath
  }

  const clickLogo = () => {
    navigate('/')
  }

  const logout = () => {
    // TODO ADD request logout
    logoutUser(accessToken, refreshToken)
    .then(res => {
      console.log(res);
      setUser(null)
      setAccessToken(null);
      setRefreshToken(null);
    })
    .catch(err => {
      console.error(err);
    })
  }

  const getLogoutPage = () => {
    return <div className={styles.navItem} onClick={logout}>
      Logout
    </div>
  }

  const getLoginPage = () => {
    return <Link to={login.path} target={login.target}
                 className={`${styles.navItem} ${isCurrentPage(login.path)? styles.current: ''}`}>
            {login.title}
          </Link>
  }

  return (
      <div className={styles.wrapper}>
        <img src={TmingLogo} alt="Tming Logo" style={{cursor: 'pointer'}} onClick={clickLogo}/>
        <div className={styles.navWrapper}>
          {navItems.map((navItem, index) => (
              <Link to={navItem.path} key={index} target={navItem.target}
                    className={`${styles.navItem} ${isCurrentPage(navItem.path) ? styles.current : ''}`}>
                {navItem.title}
              </Link>
          ))}
          {user == null? getLoginPage(): getLogoutPage()}
        </div>
      </div>
  );
}

export default Header;