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
import CustomModal from "components/common/CustomModal";
import PostDetailsModal from "components/common/PostDetailsModal";
import Pagination from "@mui/material/Pagination";
import { limitPerPage } from "constant/types";
import useSnackbar from "hooks/useSnackbar";

import ConfirmDialog from "components/common/ConfirmDialog";
import { convertUTCtoLocalDate } from "utils/calcDateTime";

const ReportTable = ({
  reportList,
  handleConfirmDialog,
  handleCloseDialog,
  page,
  handleChangePage,
  getOpenDialog,
  handleOpenReportModal,
  headers,
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((header) => {
                return (
                  <TableCell align={header.align}>
                    {header.displayName}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {reportList?.content
              ? reportList?.content.map((row, index) => (
                  <>
                    <ConfirmDialog
                      handleClose={() => handleCloseDialog("Rejected")}
                      handleConfirm={() =>
                        handleConfirmDialog("Rejected", row.id)
                      }
                      open={getOpenDialog("Rejected")}
                      title="Are you sure want to rejected this report?"
                      description="Report Content"
                    />
                    <ConfirmDialog
                      handleClose={() => handleCloseDialog("Approved")}
                      handleConfirm={() =>
                        handleConfirmDialog("Approved", row.id)
                      }
                      open={getOpenDialog("Approved")}
                      title="Are you sure want to approved this report?"
                      description="Report Content"
                    />

                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() =>
                        handleOpenReportModal(
                          index,
                          row,
                          reportList?.content,
                          row.content,
                          row.id
                        )
                      }
                    >
                      {headers.map((header) => {
                        if (header.field !== "createdAt") {
                          return (
                            <TableCell
                              component="th"
                              scope="row"
                              align={header.align}
                            >
                              {!header.multiField
                                ? row[header.field]
                                : row[header.field.split(".")[0]][
                                    header.field.split(".")[1]
                                  ]}
                            </TableCell>
                          );
                        } else
                          return (
                            <TableCell align={header.align}>
                              {convertUTCtoLocalDate(
                                row[headers[3].field],
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </TableCell>
                          );
                      })}
                    </TableRow>
                  </>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={reportList?.totalPages}
        color="primary"
        page={page}
        onChange={handleChangePage}
      />
    </>
  );
};

export default ReportTable;
