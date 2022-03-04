import * as React from "react";
import { Card, CardContent } from "@mui/material";
import PostContent from "../common/PostContent";
import Interaction from "../common/Interaction";
import CommentInput from "../common/CommentInput";
import CommentList from "../common/CommentList";
import "./style.scss";


const Post = () => {
  return (
    <Card sx={{ minWidth: 275 }} className="post-container">
      <CardContent>
        <PostContent />
        <Interaction />
        <CommentInput />
        <CommentList />
      </CardContent>
    </Card>
  );
};

export default Post;
