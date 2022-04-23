import * as React from "react";
import Post from "components/common/Post";
import { getNewFeed } from "../../../api/postService";
import InfiniteList from "components/common/InfiniteList";

const ImagesListContainer = ({ _renderItem }) => {
  return <div>{_renderItem}</div>;
};

const PostsListPage = () => {
  return (
    <InfiniteList
      container={ImagesListContainer}
      handleGetData={getNewFeed}
      data={{
        _sort: "createdAt",
        _order: "desc",
        limit: 2,
      }}
      component={Post}
      //noDataComponent={noDataComponent}
    />
  );
};

export default PostsListPage;
