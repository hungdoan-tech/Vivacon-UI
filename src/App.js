import "./App.scss";
import { useState } from "react";
import Navbar from "./components/common/Navbar";
import PostsList from "./components/PostsList";
import Loading from "./components/common/Loading";

function App() {
  const [openApp, setOpenApp] = useState(false);

  setTimeout(() => {
    setOpenApp(true);
  }, 0);
  return (
    <div className="App">
      {openApp ? (
        <>
          <div className="navbar">
            <Navbar />
          </div>
          <div className="page-content">
            <PostsList />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default App;
