import {
  getListCommentReport,
  rejectedCommentReport,
  approvedCommentReport,
} from "api/reportService";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import CustomModal from "../../common/CustomModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage } from "../../../constant/types";

import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import PostReportModal from "components/dashboard/src/components/PostReportModal";

export default function CommentReportPage() {
  const [showCommentReportModal, setShowCommentReportModal] = useState({
    open: false,
    index: -1,
    item: {},
    dataList: [],
    reportMessage: "",
    reportId: -1,
  });

  const [commentReportList, setCommentReportList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [openConfirmRejectedDialog, setOpenConfirmRejectedDialog] =
    useState(false);
  const [openConfirmApprovedDialog, setOpenConfirmApprovedDialog] =
    useState(false);

  const { setSnackbarState } = useSnackbar();

  useEffect(() => {
    fetchListCommentReport(page, limit);
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchListCommentReport(1, limit);
    } else {
      setPage(1);
    }
  }, [limit]);

  const fetchListCommentReport = (page, limit) => {
    getListCommentReport({
      _sort: null,
      limit,
      _order: null,
      page: page - 1,
    })
      .then((res) => setCommentReportList(res?.data))
      .finally(() => {});
  };

  const handleCloseConfirmRejectedDialog = () => {
    setOpenConfirmRejectedDialog(false);
  };

  const handleConfirmRejectedDialog = (id) => {
    setOpenConfirmRejectedDialog(false);
    handleRejectedCommentReport(id);
  };

  const handleCloseConfirmApprovedDialog = () => {
    setOpenConfirmApprovedDialog(false);
  };

  const handleConfirmApprovedDialog = (id) => {
    setOpenConfirmApprovedDialog(false);
    handleApprovedCommentReport(id);
  };

  const handleOpenReportModal = (
    index,
    item,
    dataList,
    reportMessage,
    reportId
  ) => {
    setShowCommentReportModal({
      open: true,
      index,
      item,
      dataList,
      reportMessage,
      reportId,
    });
  };

  const handleCloseOpenReportModal = () => {
    setShowCommentReportModal({
      open: false,
      index: -1,
      dataLength: 0,
    });
  };

  const handleOpenRejectedDialog = () => {
    setOpenConfirmRejectedDialog(true);
  };

  const handleOpenApprovedDialog = () => {
    setOpenConfirmApprovedDialog(true);
  };

  const handleRejectedCommentReport = (id) => {
    handleCloseOpenReportModal();
    rejectedCommentReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have rejected a comment report successfully`,
          type: "SUCCESS",
        });
      }
      if (commentReportList && commentReportList?.content.length === 1) {
        fetchListCommentReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListCommentReport(page, limit);
      }
    });
  };

  const handleApprovedCommentReport = (id) => {
    handleCloseOpenReportModal();
    approvedCommentReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have approved a comment report successfully`,
          type: "SUCCESS",
        });
      }
      if (commentReportList && commentReportList?.content.length === 1) {
        fetchListCommentReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListCommentReport(page, limit);
      }
    });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <div className="Table">
      <h3>Comment Report Data</h3>
      <select onChange={(event) => setLimit(+event.target.value)}>
        {limitPerPage.map((item, index) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Comment Report ID</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Sensitive Type</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">User Name</TableCell>
              <TableCell align="left">Comment Content</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {commentReportList?.content
              ? commentReportList?.content.map((row, index) => (
                  <>
                    <ConfirmDialog
                      handleClose={handleCloseConfirmRejectedDialog}
                      handleConfirm={() => handleConfirmRejectedDialog(row.id)}
                      open={openConfirmRejectedDialog}
                      title="Are you sure want to rejected this report?"
                      description="Report Content"
                    />
                    <ConfirmDialog
                      handleClose={handleCloseConfirmApprovedDialog}
                      handleConfirm={() => handleConfirmApprovedDialog(row.id)}
                      open={openConfirmApprovedDialog}
                      title="Are you sure want to approved this report?"
                      description="Report Content"
                    />

                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.content}</TableCell>
                      <TableCell align="left">{row.sentitiveType}</TableCell>

                      <TableCell align="left">
                        {moment(row.createdAt).format("DD/MM/YYYY")}
                      </TableCell>

                      <TableCell align="left">
                        {row.createdBy.username}
                      </TableCell>
                      <TableCell align="left">{row.comment.content}</TableCell>
                      <TableCell align="left" className="Details">
                        <button
                          onClick={() =>
                            handleOpenReportModal(
                              index,
                              row,
                              commentReportList?.content,
                              row.content + " " + row.sentitiveType,
                              row.id
                            )
                          }
                        >
                          Detail
                        </button>
                      </TableCell>
                    </TableRow>
                  </>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        open={showCommentReportModal.open}
        title="Is this report correct?"
        handleCloseModal={handleCloseOpenReportModal}
        width={1200}
        height={800}
      >
        <>
          <div>
            <button onClick={handleOpenRejectedDialog}>Rejected</button>
            <button onClick={handleOpenApprovedDialog}>Approved</button>
            <button onClick={handleCloseOpenReportModal}>Cancel</button>
          </div>
          <PostReportModal
            title={showCommentReportModal.reportMessage}
            index={showCommentReportModal.index}
            dataList={showCommentReportModal.dataList}
            reportId={showCommentReportModal.reportId}
            setUpdatedItem={() => null}
          />
        </>
      </CustomModal>
      <Pagination
        count={commentReportList?.totalPages}
        color="primary"
        page={page}
        onChange={handleChangePage}
      />
    </div>
  );
}
