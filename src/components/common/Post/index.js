import * as React from "react";
import { Card, CardContent } from "@mui/material";
import PostContent from "components/common/PostContent";
import Interaction from "components/common/Interaction";
import CommentInput from "components/common/CommentInput";
import CommentList from "components/common/CommentList";
import "./style.scss";


const Post = () => {
  return (
    <Card sx={{ minWidth: 275 }} className="post-container">
      <CardContent>
        <PostContent />
        {/* <Interaction /> */}
        <CommentInput />
        <CommentList />
      </CardContent>
    </Card>
  );
};

export default Post;
