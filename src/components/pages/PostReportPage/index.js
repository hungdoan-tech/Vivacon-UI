import {
  getListPostReport,
  rejectedPostReport,
  approvedPostReport,
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
import PostDetailsModal from "components/common/PostDetailsModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage } from "../../../constant/types";
import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";

export default function PostReportPage() {
  const [showPostReportModal, setShowPostReportModal] = useState({
    open: false,
    index: -1,
    item: {},
    dataList: [],
    reportMessage: "",
  });

  const [postReportList, setPostReportList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [openConfirmRejectedDialog, setOpenConfirmRejectedDialog] =
    useState(false);
  const [openConfirmApprovedDialog, setOpenConfirmApprovedDialog] =
    useState(false);

  const { setSnackbarState } = useSnackbar();

  useEffect(() => {
    fetchListPostReport(page, limit);
  }, [page]);

  useEffect(() => {
    console.log("changed limit: ");
    if (page === 1) {
      fetchListPostReport(1, limit);
    } else {
      setPage(1);
    }
  }, [limit]);

  const fetchListPostReport = (page, limit) => {
    getListPostReport({
      _sort: null,
      limit,
      _order: null,
      page: page - 1,
    })
      .then((res) => setPostReportList(res?.data))
      .finally(() => {});
  };

  const handleCloseConfirmRejectedDialog = () => {
    setOpenConfirmRejectedDialog(false);
  };

  const handleConfirmRejectedDialog = (id) => {
    setOpenConfirmRejectedDialog(false);
    handleRejectedPostReport(id);
  };

  const handleCloseConfirmApprovedDialog = () => {
    setOpenConfirmApprovedDialog(false);
  };

  const handleConfirmApprovedDialog = (id) => {
    setOpenConfirmApprovedDialog(false);
    handleApprovedPostReport(id);
  };

  const handleOpenPostReportModal = (index, item, dataList, reportMessage) => {
    setShowPostReportModal({
      open: true,
      index,
      item,
      dataList,
      reportMessage,
    });
  };

  const handleCloseOpenReportModal = () => {
    setShowPostReportModal({
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

  const handleRejectedPostReport = (id) => {
    handleCloseOpenReportModal();
    rejectedPostReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have rejected a post report successfully`,
          type: "SUCCESS",
        });
      }
      if (postReportList && postReportList?.content.length === 1) {
        fetchListPostReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListPostReport(page, limit);
      }
    });
  };

  const handleApprovedPostReport = (id) => {
    handleCloseOpenReportModal();
    approvedPostReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have approved a post report successfully`,
          type: "SUCCESS",
        });
      }
      if (postReportList && postReportList?.content.length === 1) {
        fetchListPostReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListPostReport(page, limit);
      }
    });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <div className="Table">
      <h3>Post Report Data</h3>
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
              <TableCell>Post Report ID</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Sensitive Type</TableCell>
              <TableCell align="left">Date</TableCell>

              <TableCell align="left">User Name</TableCell>
              <TableCell align="left">Post Content</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {postReportList?.content
              ? postReportList?.content.map((row, index) => (
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
                      <TableCell align="left">{row.post.caption}</TableCell>
                      <TableCell align="left" className="Details">
                        <button
                          onClick={() =>
                            handleOpenPostReportModal(
                              index,
                              row,
                              postReportList?.content,
                              row.content + " " + row.sentitiveType
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
        open={showPostReportModal.open}
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
          <PostDetailsModal
            title={showPostReportModal.reportMessage}
            index={showPostReportModal.index}
            dataList={showPostReportModal.dataList}
            setUpdatedItem={() => null}
          />
        </>
      </CustomModal>
      <Pagination
        count={postReportList?.totalPages}
        color="primary"
        page={page}
        onChange={handleChangePage}
      />
    </div>
  );
}
