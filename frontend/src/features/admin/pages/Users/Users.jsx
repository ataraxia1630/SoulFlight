import { Alert, Box, CircularProgress, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";

import ProviderService from "@/shared/services/provider.service";
import TravelerService from "@/shared/services/traveler.service";
import ProviderDialog from "./Components/ProviderDialog";
import providerColumns from "./Components/providerColumnsConfig";
import TravelerDialog from "./Components/TravelerDialog";
import travelerColumns from "./Components/travelerColumnsConfig";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Users() {
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
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              bgcolor: "primary.main",
            },
          }}
        >
          <Tab
            label="Khách du lịch"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: tabValue === 0 ? 700 : 500,
              color: tabValue === 0 ? "primary.main" : "text.secondary",
              transition: "0.3s",
              mb: 0.5,
            }}
          />
          <Tab
            label="Nhà cung cấp"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: tabValue === 1 ? 700 : 500,
              color: tabValue === 1 ? "primary.main" : "text.secondary",
              transition: "0.3s",
              mb: 0.5,
            }}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <TravelerTabContent />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <ProviderTabContent />
      </CustomTabPanel>
    </Box>
  );
}

// traveler
const TravelerTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadTraveler = useCallback(async () => {
    try {
      setLoading(true);
      const traveler = await TravelerService.getAll();
      setData(traveler);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách Traveler. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTraveler();
  }, [loadTraveler]);

  const handleSave = async (formData) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await TravelerService.adminUpdateTraveler(editingItem.id, formData);
      await loadTraveler();
      handleCloseDialog();
    } catch (err) {
      alert("Cập nhật thất bại!");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <PageHeaderWithAdd title="Khách Du Lịch" />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <CustomTable
        columns={travelerColumns}
        data={data}
        onEdit={(item) => {
          setEditingItem(item);
          setOpenDialog(true);
        }}
        onView={(row) => navigate(`/users/${row.id}`)}
      />
      <TravelerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />
    </>
  );
};

// provider
const ProviderTabContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProvider = useCallback(async () => {
    try {
      setLoading(true);
      const provider = await ProviderService.getAll();
      setData(provider);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách Provider. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  const handleSave = async (formData) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await ProviderService.adminUpdateProvider(editingItem.id, formData);
      await loadProvider();
      handleCloseDialog();
    } catch (err) {
      alert("Cập nhật thất bại!");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <PageHeaderWithAdd title="Nhà Cung Cấp" />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <CustomTable
        columns={providerColumns}
        data={data}
        onEdit={(item) => {
          setEditingItem(item);
          setOpenDialog(true);
        }}
        onView={(row) => navigate(`/users/${row.id}`)}
      />
      <ProviderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />
    </>
  );
};
