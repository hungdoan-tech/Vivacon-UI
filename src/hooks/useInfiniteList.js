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
  const [isNoData, setNoData] = useState(false);

  useEffect(() => {
    setDataList([]);
  }, []);

  useEffect(() => {
    if (pageNumber > 0) {
      setLoading(true);
      setError(false);
      // let cancel;
      handleGetData({ ...data, page: pageNumber })
        .then((res) => {
          setDataList((prevDataList) => {
            return [...new Set([...prevDataList, ...res.data.content])];
          });
          setHasMore(!res.data.last);
          setLoading(false);
          if (pageNumber === 0 && res.data.content.length === 0) {
            setNoData(true);
          }
        })
        .catch((e) => {
          // if (axios.isCancel(e)) return;
          setError(true);
        });
    }
    // return () => cancel();
  }, [pageNumber]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setNoData(false)
    // let cancel;
    handleGetData({ ...data, page: 0 })
      .then((res) => {
        setDataList((prevDataList) => {
          return [...new Set([...res.data.content])];
        });
        setHasMore(!res.data.last);
        setLoading(false);
        if (res.data.content.length === 0) {
          setNoData(true);
        }
      })
      .catch((e) => {
        // if (axios.isCancel(e)) return;
        setError(true);
      });
    // return () => cancel();
  }, [data.username]);

  return { isLoading, error, dataList, hasMore, isNoData };
};

export default useInfiniteList;
