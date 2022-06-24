import { useEffect, useState } from "react";
import axios from "axios";
import { getPostsByUserName } from "api/postService";
import axiosConfig from "api/axiosConfig";
import { API_ENDPOINT_KEYS } from "api/constants";
import _ from "lodash";
import { getDifferenceItemBetweenTwoArrays } from "utils/resolveData";

const useInfiniteList = (handleGetData, data, pageNumber, parentDataList) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isNoData, setNoData] = useState(false);

  useEffect(() => {
    setDataList([]);
  }, []);

  useEffect(() => {
    console.log(
      "COMPARE CHANGE: ",
      parentDataList,
      dataList,
      _.isEqual(dataList, parentDataList)
    );
    if (parentDataList?.length > 0 || !_.isEqual(parentDataList, dataList)) {
      console.log("COMPARE CHANGE IF PASS");
      setDataList(parentDataList);
    }
  }, [parentDataList]);

  useEffect(() => {
    if (dataList) {
      if (dataList.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
    }
  }, [dataList]);

  useEffect(() => {
    if (pageNumber > 0) {
      setLoading(true);
      setError(false);
      // let cancel;
      handleGetData({ ...data, page: pageNumber })
        .then((res) => {
          const differenceContent = getDifferenceItemBetweenTwoArrays(
            res.data.content,
            dataList
          );
          setDataList((prevDataList) => {
            return [...new Set([...prevDataList, ...differenceContent])];
          });
          setHasMore(!res.data.last);
          setLoading(false);
        })
        .catch((e) => {
          // if (axios.isCancel(e)) return;
          setError(true);
        });
    }
    // return () => cancel();
  }, [pageNumber]);

  useEffect(() => {
    if (data.username) {
      setLoading(true);
      setError(false);
      setNoData(false);
      // let cancel;
      handleGetData({ ...data, page: 0 })
        .then((res) => {
          const differenceContent = getDifferenceItemBetweenTwoArrays(
            res.data.content,
            dataList
          );
          setDataList((prevDataList) => {
            return [...new Set([...differenceContent])];
          });
          setHasMore(!res.data.last);
          setLoading(false);
        })
        .catch((e) => {
          // if (axios.isCancel(e)) return;
          setError(true);
        });
    }
    // return () => cancel();
  }, [data.username]);

  useEffect(() => {
    if (data.name) {
      setLoading(true);
      setError(false);
      setNoData(false);
      // let cancel;
      handleGetData({ ...data, page: 0 })
        .then((res) => {
          const differenceContent = getDifferenceItemBetweenTwoArrays(
            res.data.content,
            dataList
          );
          setDataList((prevDataList) => {
            return [...new Set([...differenceContent])];
          });
          setHasMore(!res.data.last);
          setLoading(false);
        })
        .catch((e) => {
          // if (axios.isCancel(e)) return;
          setError(true);
        });
    }
    // return () => cancel();
  }, [data.name]);

  useEffect(() => {
    if (data.status) {
      setLoading(true);
      setError(false);
      setNoData(false);
      // let cancel;
      handleGetData({ ...data, page: 0 })
        .then((res) => {
          setDataList((prevDataList) => {
            return [...new Set([...res.data.content])];
          });
          setHasMore(!res.data.last);
          setLoading(false);
        })
        .catch((e) => {
          setError(true);
        });
    }
  }, [data.status]);

  return { isLoading, error, dataList, hasMore, isNoData };
};

export default useInfiniteList;
