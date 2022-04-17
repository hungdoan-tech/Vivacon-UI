import { useEffect, useState } from "react";
import axios from "axios";
import { getPostsByUserName } from "api/postService";
import axiosConfig from "api/axiosConfig";
import { API_ENDPOINT_KEYS } from "api/constants";

const useInfiniteList = (handleGetData, data, pageNumber) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    console.log("initial");
    setDataList([]);
  }, []);

  useEffect(() => {
    console.log("iscall");
    setLoading(true);
    setError(false);
    // let cancel;
    handleGetData({ ...data, page: pageNumber })
      .then((res) => {
        console.log({ res });
        setDataList((prevDataList) => {
          return [...new Set([...prevDataList, ...res.data.content])];
        });
        setHasMore(!res.data.last);
        setLoading(false);
      })
      .catch((e) => {
        // if (axios.isCancel(e)) return;
        setError(true);
      });
    // return () => cancel();
  }, [pageNumber]);

  return { isLoading, error, dataList, hasMore };
};

export default useInfiniteList;
