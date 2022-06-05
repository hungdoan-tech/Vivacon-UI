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
import CustomModal from "../../common/CustomModal";
import PostDetailsModal from "components/common/PostDetailsModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage } from "../../../constant/types";
import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import AccountReportModal from "components/dashboard/src/components/AccountReportModal";

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

  const handleCloseConfirmRejectedDialog = () => {
    setOpenConfirmRejectedDialog(false);
  };

  const handleConfirmRejectedDialog = (id) => {
    setOpenConfirmRejectedDialog(false);
    handleRejectedAccountReport(id);
  };

  const handleCloseConfirmApprovedDialog = () => {
    setOpenConfirmApprovedDialog(false);
  };

  const handleConfirmApprovedDialog = (id) => {
    setOpenConfirmApprovedDialog(false);
    handleApprovedAccountReport(id);
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

  const handleCloseOpenReportModal = () => {
    setShowAccountReportModal({
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

  const handleRejectedAccountReport = (id) => {
    handleCloseOpenReportModal();
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
    handleCloseOpenReportModal();
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

  return (
    <div className="Table">
      <h3>Account Report Data</h3>
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
              <TableCell>Account Report ID</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Sensitive Type</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">User Name</TableCell>
              <TableCell align="left">Account Content</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {accountReportList?.content
              ? accountReportList?.content.map((row, index) => (
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

                      <TableCell align="left">{row.account.username}</TableCell>
                      <TableCell align="left">{row.account.bio}</TableCell>
                      <TableCell align="left" className="Details">
                        <button
                          onClick={() =>
                            handleOpenAccountReportModal(
                              index,
                              row,
                              accountReportList?.content,
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
        open={showAccountReportModal.open}
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
          <AccountReportModal
            title={showAccountReportModal.reportMessage}
            index={showAccountReportModal.index}
            dataList={showAccountReportModal.dataList}
            item={showAccountReportModal.item}
            setUpdatedItem={() => null}
          />
        </>
      </CustomModal>
      <Pagination
        count={accountReportList?.totalPages}
        color="primary"
        page={page}
        onChange={handleChangePage}
      />
    </div>
  );
}
