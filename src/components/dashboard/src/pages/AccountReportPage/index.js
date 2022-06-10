import {
  getListAccountReport,
  rejectedAccountReport,
  approvedAccountReport,
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
import { limitPerPage } from "../../../../../constant/types";
import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import AccountReportModal from "components/dashboard/src/components/AccountReportModal";
import { Typography, Button, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { reportContent } from "constant/types";
import "./style.scss";
import ReportTable from "components/dashboard/src/components/ReportTable";
import ReportHeader from "components/dashboard/src/components/ReportHeader";

export default function AccountReportPage() {
  const [showAccountReportModal, setShowAccountReportModal] = useState({
    open: false,
    index: -1,
    item: {},
    dataList: [],
    reportMessage: "",
  });

  const [accountReportList, setAccountReportList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [openConfirmRejectedDialog, setOpenConfirmRejectedDialog] =
    useState(false);
  const [openConfirmApprovedDialog, setOpenConfirmApprovedDialog] =
    useState(false);
  const [reportDetailContent, setReportDetailContent] = useState("");

  const { setSnackbarState } = useSnackbar();

  useEffect(() => {
    fetchListAccountReport(page, limit);
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchListAccountReport(1, limit);
    } else {
      setPage(1);
    }
  }, [limit]);

  const fetchListAccountReport = (page, limit) => {
    getListAccountReport({
      _sort: null,
      limit,
      _order: null,
      page: page - 1,
    })
      .then((res) => setAccountReportList(res?.data))
      .finally(() => {});
  };

  const handleOpenAccountReportModal = (
    index,
    item,
    dataList,
    reportMessage
  ) => {
    setShowAccountReportModal({
      open: true,
      index,
      item,
      dataList,
      reportMessage,
    });
  };

  const handleCloseAccountReportModal = () => {
    setShowAccountReportModal({
      open: false,
      index: -1,
      dataLength: 0,
    });
  };

  const handleRejectedAccountReport = (id) => {
    handleCloseAccountReportModal();
    rejectedAccountReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have rejected a account report successfully`,
          type: "SUCCESS",
        });
      }
      if (accountReportList && accountReportList?.content.length === 1) {
        fetchListAccountReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListAccountReport(page, limit);
      }
    });
  };

  const handleApprovedAccountReport = (id) => {
    handleCloseAccountReportModal();
    approvedAccountReport(id).then((res) => {
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          content: `You have approved a account report successfully`,
          type: "SUCCESS",
        });
      }
      if (accountReportList && accountReportList?.content.length === 1) {
        fetchListAccountReport(page - 1, limit);
        setPage(page - 1);
      } else {
        fetchListAccountReport(page, limit);
      }
    });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (showAccountReportModal.reportMessage) {
      const filterReportDetail = reportContent.filter(
        (item) => item.content === showAccountReportModal.reportMessage
      )[0].detailContent;
      const plainText = filterReportDetail.reduce((prev, curr) => {
        if (prev === "") {
          return " - " + curr;
        }
        return prev + "\n\n" + " - " + curr;
      }, "");
      setReportDetailContent(plainText);
    }
  }, [showAccountReportModal]);

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
      handleApprovedAccountReport(id);
    }
    if (type === "Rejected") {
      setOpenConfirmRejectedDialog(false);
      handleRejectedAccountReport(id);
    }
  };

  const headers = [
    {
      displayName: "Account Report ID",
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
      field: "account.username",
    },
    {
      displayName: "Account Content",
      align: "left",
      multiField: true,
      field: "account.bio",
    },
  ];


  return (
    <div className="Table">
      <h3>Account Report Data</h3>
      <select onChange={(event) => setLimit(+event.target.value)}>
        {limitPerPage.map((item, index) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ReportTable
        reportList={accountReportList}
        page={page}
        handleChangePage={handleChangePage}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDialog={handleConfirmDialog}
        getOpenDialog={getOpenDialog}
        handleOpenReportModal={handleOpenAccountReportModal}
        headers={headers}
      />

      <CustomModal
        open={showAccountReportModal.open}
        title=""
        handleCloseModal={handleCloseAccountReportModal}
        width={1200}
        height={800}
      >
        <Typography component="div" className="report-admin-modal">
          <ReportHeader
            handleApprove={() => handleOpenConfirmDialog("Approved")}
            handleReject={() => handleOpenConfirmDialog("Rejected")}
            handleCancel={() => handleCloseAccountReportModal()}
            reportMessage={showAccountReportModal.reportMessage}
            reportDetailContent={reportDetailContent}
          />
          <AccountReportModal
            title={showAccountReportModal.reportMessage}
            index={showAccountReportModal.index}
            dataList={showAccountReportModal.dataList}
            item={showAccountReportModal.item}
            setUpdatedItem={() => null}
          />
        </Typography>
      </CustomModal>
    </div>
  );
}
