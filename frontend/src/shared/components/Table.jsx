import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

export default function CustomTable({ columns, data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc dữ liệu theo search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter(
      (row) => row.id.toLowerCase().includes(lower) || row.provider.toLowerCase().includes(lower),
    );
  }, [data, searchTerm]);

  // Phân trang
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(0);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ mt: 4, borderRadius: 2, overflow: "hidden" }}
      >
        <Table sx={{ minWidth: 650, tableLayout: "fixed" }} size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.header_align || "center"}
                  width={column.width}
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    borderBottom: "1px solid #E0E0E0",
                    padding: "16px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No data found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                >
                  {columns.map((column) => {
                    const globalIndex = page * rowsPerPage + index;
                    const value = column.id === "index" ? globalIndex : row[column.id];
                    const content = column.render ? column.render(value, row, globalIndex) : value;

                    return (
                      <TableCell
                        key={column.id}
                        align={column.cell_align || "left"}
                        sx={{
                          padding: "16px",
                          borderBottom: "1px solid #F0F0F0",
                          ...column.sx,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: column.sx?.fontWeight || 400 }}
                        >
                          {content}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Rows per page:"
        sx={{
          mt: 2,
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            fontSize: "0.875rem",
          },
        }}
      />
    </Box>
  );
}
