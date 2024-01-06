import styles from './app.module.scss';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import {Route, Routes} from "react-router-dom";
import Home from "./components/home/home";
import Recruit from "./components/recruit/recruit";
import Sample from "./components/sample/sample";

function App() {
  return (
    <div className={styles.wrapper}>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/recruit" element={<Recruit/>}></Route>
          <Route path="/sample" element={<Sample/>}></Route>
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
