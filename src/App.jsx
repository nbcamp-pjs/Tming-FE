import styles from './app.module.scss';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import {Route, Routes} from "react-router-dom";
import Home from "./components/home/home";
import Recruit from "./components/recruit/recruit";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import ScrollToTop from "./utils/ScrollRestoration";
import Profile from "./components/profile/profile";

function App() {
  return (
    <div className={styles.wrapper}>
      <Header/>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/profile/:userId" element={<Profile/>}></Route>
        <Route path="/recruit" element={<Recruit/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
