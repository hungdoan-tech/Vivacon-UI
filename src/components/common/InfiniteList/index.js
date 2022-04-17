import { useState, useEffect, useRef, useCallback } from "react";
import useInfiniteList from "hooks/useInfiniteList";
import ReactLoading from "react-loading";
import "./style.scss";

const InfiniteList = (props) => {
  const [pageNumber, setPageNumber] = useState(0);
  const {
    component: Component,
    container: Container,
    noDataComponent: NoDataComponent,
    handleGetData,
    data,
  } = props;
  const { dataList, isLoading, hasMore } = useInfiniteList(
    handleGetData,
    data,
    pageNumber
  );

  const observer = useRef();

  useEffect(() => {
    // setPageNumber(0);
  }, []);

  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          console.log({ entries });
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );
  console.log({ lastItemRef });
  return (
    <>
      {dataList.length > 0 ? (
        <Container
          _renderItem={
            <>
              {dataList.map((item, index) => {
                if (dataList.length === index + 1) {
                  return (
                    <div ref={lastItemRef} key={item}>
                      <Component item={item} />
                    </div>
                  );
                } else {
                  return (
                    <div key={item}>
                      <Component item={item} />
                    </div>
                  );
                }
              })}
              {isLoading && (
                <ReactLoading
                  className="loading-more-icon"
                  type="spokes"
                  color="#00000"
                  height={36}
                  width={36}
                />
              )}
            </>
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default InfiniteList;
