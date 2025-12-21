import { Alert, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import LoadingState from "@/shared/components/LoadingState";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import MenuService from "@/shared/services/menu.service";
import RoomService from "@/shared/services/room.service";
import TicketService from "@/shared/services/ticket.service";
import TourService from "@/shared/services/tour.service";
import { menuColumns, roomColumns, ticketColumns, tourColumns } from "./Components/columnsConfig";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ mb: 2 }}>
    {message}
  </Alert>
);

const extractData = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  if (res && Array.isArray(res.items)) return res.items;
  return [];
};

const tabStyle = (currentValue, index) => ({
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: currentValue === index ? 700 : 500,
  color: currentValue === index ? "primary.main" : "text.secondary",
  transition: "0.3s",
  mb: 0.5,
});

export default function Services() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              bgcolor: "primary.main",
            },
          }}
        >
          <Tab label="Tour" sx={tabStyle(tabValue, 0)} />
          <Tab label="Leisure" sx={tabStyle(tabValue, 1)} />
          <Tab label="FnB" sx={tabStyle(tabValue, 2)} />
          <Tab label="Stay" sx={tabStyle(tabValue, 3)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <TourTabContent />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <TicketTabContent />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <MenuTabContent />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={3}>
        <RoomTabContent />
      </CustomTabPanel>
    </Box>
  );
}

// tour
const TourTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await TourService.getAll();
      setData(extractData(res));
    } catch (err) {
      setError("Không thể tải danh sách Tour.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClickDelete = (item) => {
    setDeleteItem(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await TourService.delete(deleteItem.id);
      await loadData();
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    } catch {
      alert("Xóa thất bại");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeaderWithAdd title="Tour" />
      {error && <ErrorAlert message={error} />}
      <CustomTable
        columns={tourColumns}
        data={data}
        onView={(row) => navigate(`/services/${row.id}?type=tour`)}
        onDelete={handleClickDelete}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name}
      />
    </>
  );
};

// ticket
const TicketTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await TicketService.getAll();
      setData(extractData(res));
    } catch (err) {
      setError("Không thể tải danh sách Ticket.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClickDelete = (item) => {
    setDeleteItem(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await TicketService.delete(deleteItem.id);
      await loadData();
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    } catch {
      alert("Xóa thất bại!");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeaderWithAdd title="Ticket" />
      {error && <ErrorAlert message={error} />}
      <CustomTable
        columns={ticketColumns}
        data={data}
        onView={(row) => navigate(`/services/${row.id}?type=leisure`)}
        onDelete={handleClickDelete}
      />
      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name}
      />
    </>
  );
};

// menu
const MenuTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await MenuService.getAll();
      setData(extractData(res));
    } catch (err) {
      setError("Không thể tải danh sách Menu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClickDelete = (item) => {
    setDeleteItem(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await MenuService.delete(deleteItem.id);
      await loadData();
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    } catch {
      alert("Xóa thất bại!");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeaderWithAdd title="FnB" />
      {error && <ErrorAlert message={error} />}
      <CustomTable
        columns={menuColumns}
        data={data}
        onView={(row) => navigate(`/services/${row.id}?type=fnb`)}
        onDelete={handleClickDelete}
      />
      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name}
      />
    </>
  );
};

// room
const RoomTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RoomService.getAll();
      setData(extractData(res));
    } catch (err) {
      setError("Không thể tải danh sách Room.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClickDelete = (item) => {
    setDeleteItem(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await RoomService.delete(deleteItem.id);
      await loadData();
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    } catch {
      alert("Xóa thất bại!");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeaderWithAdd title="Stay" />
      {error && <ErrorAlert message={error} />}
      <CustomTable
        columns={roomColumns}
        data={data}
        onView={(row) => navigate(`/services/${row.id}?type=stay`)}
        onDelete={handleClickDelete}
      />
      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name}
      />
    </>
  );
};
