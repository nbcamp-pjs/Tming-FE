import styles from './header.module.scss'
import alertify from "alertifyjs";
import 'alertifyjs/build/css/alertify.css';
import {TmingLogo} from "../../assets";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accessTokenState, refreshTokenState, userState} from "../../states";
import {logoutUser} from "../../apis/user";
import {useEffect, useRef} from "react";

const Header = () => {
  const navItems = [
    {
      title: 'Home',
      path: '/',
    },
  ]

  const myProfile = {
    title: 'Profile',
    path: '/profile/'
  }

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
      alertify.success('로그아웃 되었습니다.');
      setUser(null)
      setAccessToken(null);
      setRefreshToken(null);
      navigate('/login')
    })
    .catch(err => {
      console.error(err);
    })
  }

  const getProfilePage = () => {
    return <Link to={myProfile.path + user.userId} target={myProfile.target}
                 className={`${styles.navItem} ${isCurrentPage(myProfile.path) ? styles.current : ''}`}>
      {myProfile.title}
    </Link>
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
            {user == null? '': getProfilePage()}
            {user == null? getLoginPage(): getLogoutPage()}
          </div>
        </div>
      </div>
  );
}

export default Header;