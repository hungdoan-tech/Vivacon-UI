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
import CustomModal from "../../../../common/CustomModal";
import PostDetailsModal from "components/common/PostDetailsModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage, reportContent } from "../../../../../constant/types";
import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import { convertUTCtoLocalDate } from "utils/calcDateTime";
import ReportTable from "components/dashboard/src/components/ReportTable";
import { IconButton, Tooltip, Typography, Button } from "@mui/material";
import "./style.scss";
import PostReportModal from "components/dashboard/src/components/PostReportModal";
import ReportHeader from "components/dashboard/src/components/ReportHeader";

export default function PostReportPage() {
  const [showPostReportModal, setShowPostReportModal] = useState({
    open: false,
    index: -1,
    item: {},
    dataList: [],
    reportMessage: "",
    reportId: -1,
  });

  const [postReportList, setPostReportList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [openConfirmRejectedDialog, setOpenConfirmRejectedDialog] =
    useState(false);
  const [openConfirmApprovedDialog, setOpenConfirmApprovedDialog] =
    useState(false);

  const [reportDetailContent, setReportDetailContent] = useState("");

  const { setSnackbarState } = useSnackbar();

  useEffect(() => {
    fetchListPostReport(page, limit);
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchListPostReport(1, limit);
    } else {
      setPage(1);
    }
  }, [limit]);

  useEffect(() => {
    console.log({ showPostReportModal });
    if (showPostReportModal.reportMessage) {
      const filterReportDetail = reportContent.filter(
        (item) => item.content === showPostReportModal.reportMessage
      )[0].detailContent;
      const plainText = filterReportDetail.reduce((prev, curr) => {
        if (prev === "") {
          return " - " + curr;
        }
        return prev + "\n\n" + " - " + curr;
      }, "");
      setReportDetailContent(plainText);
    }
  }, [showPostReportModal]);

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

  const handleOpenPostReportModal = (
    index,
    item,
    dataList,
    reportMessage,
    reportId
  ) => {
    setShowPostReportModal({
      open: true,
      index,
      item,
      dataList,
      reportMessage,
      reportId,
    });
  };

  const handleClosePostReportModal = () => {
    setShowPostReportModal({
      open: false,
      index: -1,
      dataLength: 0,
    });
  };

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
      handleApprovedPostReport(id);
    }
    if (type === "Rejected") {
      setOpenConfirmRejectedDialog(false);
      handleRejectedPostReport(id);
    }
  };

  const handleRejectedPostReport = (id) => {
    handleClosePostReportModal();
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
    handleClosePostReportModal();
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

  const headers = [
    {
      displayName: "Post Report ID",
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
      displayName: "Post Content",
      align: "left",
      multiField: true,
      field: "post.caption",
    },
  ];

  return (
    <div className="Table">
      <h3>Post Report Data</h3>
      <select onChange={(event) => setLimit(+event.target.value)}>
        {limitPerPage.map((item, index) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ReportTable
        reportList={postReportList}
        headers={headers}
        page={page}
        handleChangePage={handleChangePage}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDialog={handleConfirmDialog}
        getOpenDialog={getOpenDialog}
        handleOpenReportModal={handleOpenPostReportModal}
      />

      <CustomModal
        open={showPostReportModal.open}
        title=""
        handleCloseModal={handleClosePostReportModal}
        width={1200}
        height={800}
      >
        <Typography component="div" className="report-admin-modal">
          <ReportHeader
            handleApprove={() => handleOpenConfirmDialog("Approved")}
            handleReject={() => handleOpenConfirmDialog("Rejected")}
            handleCancel={() => handleClosePostReportModal()}
            reportMessage={showPostReportModal.reportMessage}
            reportDetailContent={reportDetailContent}
          />
          <PostReportModal
            title={showPostReportModal.reportMessage}
            index={showPostReportModal.index}
            dataList={showPostReportModal.dataList}
            reportId={showPostReportModal.reportId}
            setUpdatedItem={() => null}
          />
        </Typography>
      </CustomModal>
    </div>
  );
}