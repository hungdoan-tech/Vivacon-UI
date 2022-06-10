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
import CustomModal from "../../../../common/CustomModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage, reportContent } from "../../../../../constant/types";

import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import PostReportModal from "components/dashboard/src/components/PostReportModal";
import ReportTable from "components/dashboard/src/components/ReportTable";
import { Typography } from "@mui/material";
import ReportHeader from "components/dashboard/src/components/ReportHeader";

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

  const [reportDetailContent, setReportDetailContent] = useState("");

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

  const handleCloseReportModal = () => {
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
    handleCloseReportModal();
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
    handleCloseReportModal();
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

  useEffect(() => {
    if (showCommentReportModal.reportMessage) {
      const filterReportDetail = reportContent.filter(
        (item) => item.content === showCommentReportModal.reportMessage
      )[0].detailContent;
      const plainText = filterReportDetail.reduce((prev, curr) => {
        if (prev === "") {
          return " - " + curr;
        }
        return prev + "\n\n" + " - " + curr;
      }, "");
      setReportDetailContent(plainText);
    }
  }, [showCommentReportModal]);

  const handleOpenConfirmDialog = (type) => {
    if (type === "Approved") {
      setOpenConfirmApprovedDialog(true);
    }
    if (type === "Rejected") {
      setOpenConfirmRejectedDialog(true);
    }
  };

  const getOpenDialog = (type) => {
    if (type === "Approved") {
      return openConfirmApprovedDialog;
    }
    if (type === "Rejected") {
      return openConfirmRejectedDialog;
    }
  };

  const handleCloseDialog = (type) => {
    if (type === "Approved") {
      setOpenConfirmApprovedDialog(false);
    }
    if (type === "Rejected") {
      setOpenConfirmRejectedDialog(false);
    }
  };
  const handleConfirmDialog = (type, id) => {
    if (type === "Approved") {
      setOpenConfirmApprovedDialog(false);
      handleApprovedCommentReport(id);
    }
    if (type === "Rejected") {
      setOpenConfirmRejectedDialog(false);
      handleRejectedCommentReport(id);
    }
  };

  const headers = [
    {
      displayName: "Comment Report ID",
      align: "center",
      field: "id",
    },
    {
      displayName: "Content",
      align: "left",
      field: "content",
    },
    {
      displayName: "Sensitive Type",
      align: "left",
      field: "sentitiveType",
    },
    {
      displayName: "Date",
      align: "left",
      field: "createdAt",
    },
    {
      displayName: "User Name",
      align: "left",
      multiField: true,
      field: "createdBy.username",
    },
    {
      displayName: "Comment Content",
      align: "left",
      multiField: true,
      field: "comment.content",
    },
  ];

  return (
    <div className="Table">
      <h3>Comment Report Data</h3>
      <select onChange={(event) => setLimit(+event.target.value)}>
        {limitPerPage.map((item, index) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ReportTable
        reportList={commentReportList}
        page={page}
        handleChangePage={handleChangePage}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDialog={handleConfirmDialog}
        getOpenDialog={getOpenDialog}
        handleOpenReportModal={handleOpenReportModal}
        headers={headers}
      />

      <CustomModal
        open={showCommentReportModal.open}
        title=""
        handleCloseModal={handleCloseReportModal}
        width={1200}
        height={800}
      >
        <Typography component="div" className="report-admin-modal">
          <ReportHeader
            handleApprove={() => handleOpenConfirmDialog("Approved")}
            handleReject={() => handleOpenConfirmDialog("Rejected")}
            handleCancel={() => handleCloseReportModal()}
            reportMessage={showCommentReportModal.reportMessage}
            reportDetailContent={reportDetailContent}
          />
          <PostReportModal
            title={showCommentReportModal.reportMessage}
            index={showCommentReportModal.index}
            dataList={showCommentReportModal.dataList}
            reportId={showCommentReportModal.reportId}
            setUpdatedItem={() => null}
          />
        </Typography>
      </CustomModal>
    </div>
  );
}
