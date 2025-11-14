import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

export default function CustomTable({ columns, data, onView, onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc dữ liệu theo search
  const searchableFields = columns.filter((c) => c.search).map((c) => c.id);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchableFields.some((field) =>
        String(row[field] || "")
          .toLowerCase()
          .includes(lower),
      ),
    );
  }, [data, searchTerm, searchableFields]);

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

  const renderActions = (row) => {
    const actions = [];

    if (onView) {
      actions.push(
        <Tooltip key="view" title="View">
          <IconButton
            size="small"
            onClick={() => onView(row)}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "rgba(30, 155, 205, 0.08)" },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      );
    }

    if (onEdit) {
      actions.push(
        <Tooltip key="edit" title="Edit">
          <IconButton
            size="small"
            onClick={() => onEdit(row)}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "rgba(30, 155, 205, 0.08)" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      );
    }

    if (onDelete) {
      actions.push(
        <Tooltip key="delete" title="Delete">
          <IconButton
            size="small"
            onClick={() => onDelete(row)}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      );
    }

    return <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>{actions}</Box>;
  };

  return (
    <Box
      sx={{
        mt: 4,
        backgroundColor: "#FFFFFF",
        border: "0.1px solid #E5E7EB",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
        padding: 4,
      }}
    >
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

      <TableContainer>
        <Table sx={{ minWidth: 650, tableLayout: "fixed", bgcolor: "#FFFFFF" }} size="medium">
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

                    if (column.id === "actions" && (onView || onEdit || onDelete)) {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.cell_align || "center"}
                          sx={{
                            padding: "16px",
                            borderBottom: "1px solid #F0F0F0",
                            ...column.sx,
                          }}
                        >
                          {renderActions(row)}
                        </TableCell>
                      );
                    }

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
                        {column.is_picture ? (
                          <Box
                            component="img"
                            src={content}
                            alt={row.name}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: column.sx?.fontWeight || 400 }}
                          >
                            {content}
                          </Typography>
                        )}
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
