import * as React from "react";
import { useState, useEffect } from "react";
import Post from "components/common/Post";
import { getNewFeed } from "../../../api/postService";

const PostsListPage = () => {
  console.log("useEffect is not call first rendered!");

  const [dataList, setDataList] = useState([]);

  console.log(dataList);

  const handleGetNewFeed = (data) => {
    getNewFeed(data)
      .then((res) => {
        if (res.status === 200) {
          setDataList(res.data.content);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        // setLoading(false);
        // setLocalLoading({ status: false, index: -1 });
      });
  };

  useEffect(() => {
    console.log("useEffect is call after rendered component!");
    handleGetNewFeed({ limit: 3, page: 0 });
  }, []);

  return (
    <>
      {dataList.map((item, index) => {
        return <Post item={item} />;
      })}
    </>
  );
};

export default PostsListPage;
