import styles from './app.module.scss';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import {Route, Routes} from "react-router-dom";
import Recruit from "./components/recruit/recruit";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import ScrollToTop from "./utils/ScrollRestoration";
import RecruitPost from "./components/recruit/post/recruitPost";
import Profile from "./components/profile/profile";
import RecruitDetails from "./components/recruit/details/recruitDetails";
import Chat from "./components/chat/chat";

function App() {
  return (
    <div className={styles.wrapper}>
      <Header/>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Recruit/>}></Route>
        <Route path="/post" element={<RecruitPost/>}></Route>
        <Route path="/post/:postId" element={<RecruitDetails/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/profile/:userId" element={<Profile/>}></Route>
        <Route path="/chat" element={<Chat/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
