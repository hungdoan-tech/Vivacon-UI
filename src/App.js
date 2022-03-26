import "./App.scss";
import { useState } from "react";
import Navbar from "./components/common/Navbar";
import PostsList from "./components/PostsList";
import { InitLoading } from "./components/common/Loading";

function App() {
  const [openApp, setOpenApp] = useState(false);

  setTimeout(() => {
    setOpenApp(true);
  }, 2000);
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
        <InitLoading />
      )}
    </div>
  );
}

export default App;
