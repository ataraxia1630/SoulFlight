import { Alert, Box, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import LoadingState from "@/shared/components/LoadingState";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import MenuService from "@/shared/services/menu.service";
import ReviewService from "@/shared/services/review.service";
import RoomService from "@/shared/services/room.service";
import ServiceService from "@/shared/services/service.service";
import TicketService from "@/shared/services/ticket.service";
import TourService from "@/shared/services/tour.service";

import { menuColumns, roomColumns, ticketColumns, tourColumns } from "./Components/columnsConfig";
import MenuDetailDialog from "./Components/MenuDetailDialog";
import RoomDetailDialog from "./Components/RoomDetailDialog";
import TicketDetailDialog from "./Components/TicketDetailDialog";
import TourDetailDialog from "./Components/TourDetailDialog";

const extractData = (res) => {
  if (Array.isArray(res)) return res;
  return res?.data || res?.items || [];
};

const tabStyle = (currentValue, tabId) => ({
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: currentValue === tabId ? 700 : 500,
  color: currentValue === tabId ? "primary.main" : "text.secondary",
  transition: "0.3s",
  mb: 0.5,
});

const STORAGE_KEY = "services_active_tab";

const BaseTabContent = ({ title, serviceAPI, columns, DetailDialog }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [viewItem, setViewItem] = useState(null);
  const [relatedService, setRelatedService] = useState(null);
  const [relatedReviews, setRelatedReviews] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await serviceAPI.getAll();
      setData(extractData(res));
    } catch {
      setError(`Không thể tải danh sách ${title}.`);
    } finally {
      setLoading(false);
    }
  }, [serviceAPI, title]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleView = async (item) => {
    setViewItem(item);
    setLoadingDetail(true);
    try {
      if (item.service_id) {
        const [serviceRes, reviewsRes] = await Promise.all([
          ServiceService.getById(item.service_id),
          ReviewService.getByService(item.service_id),
        ]);
        setRelatedService(serviceRes.data);
        setRelatedReviews(extractData(reviewsRes));
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseView = () => {
    setViewItem(null);
    setRelatedService(null);
    setRelatedReviews([]);
  };

  const handleConfirmDelete = async () => {
    try {
      await serviceAPI.delete(deleteItem.id);
      loadData();
      setOpenDeleteDialog(false);
    } catch {
      alert("Xóa thất bại!");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeaderWithAdd title={title} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={data}
        onView={handleView}
        onDelete={(item) => {
          setDeleteItem(item);
          setOpenDeleteDialog(true);
        }}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.name}
      />

      <DetailDialog
        key={viewItem ? `detail-${viewItem.id}` : "detail-closed"}
        open={!!viewItem}
        onClose={handleCloseView}
        data={viewItem}
        service={relatedService}
        provider={relatedService?.provider}
        reviews={relatedReviews}
        loading={loadingDetail}
      />
    </>
  );
};

export default function Services() {
  const [tabValue, setTabValue] = useState("tour");

  const tabsConfig = useMemo(
    () => [
      {
        id: "tour",
        label: "Tour",
        title: "Tour",
        api: TourService,
        cols: tourColumns,
        dialog: TourDetailDialog,
      },
      {
        id: "leisure",
        label: "Leisure",
        title: "Ticket",
        api: TicketService,
        cols: ticketColumns,
        dialog: TicketDetailDialog,
      },
      {
        id: "fnb",
        label: "FnB",
        title: "FnB",
        api: MenuService,
        cols: menuColumns,
        dialog: MenuDetailDialog,
      },
      {
        id: "stay",
        label: "Stay",
        title: "Stay",
        api: RoomService,
        cols: roomColumns,
        dialog: RoomDetailDialog,
      },
    ],
    [],
  );

  useEffect(() => {
    const savedTab = localStorage.getItem(STORAGE_KEY);
    if (savedTab && tabsConfig.some((tab) => tab.id === savedTab)) {
      setTabValue(savedTab);
    }
  }, [tabsConfig]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    localStorage.setItem(STORAGE_KEY, newValue);
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" } }}
        >
          {tabsConfig.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={tab.label} sx={tabStyle(tabValue, tab.id)} />
          ))}
        </Tabs>
      </Box>

      {tabsConfig.map(
        (tab) =>
          tabValue === tab.id && (
            <Box key={tab.id} sx={{ pt: 3 }}>
              {" "}
              <BaseTabContent
                title={tab.title}
                serviceAPI={tab.api}
                columns={tab.cols}
                DetailDialog={tab.dialog}
              />
            </Box>
          ),
      )}
    </Box>
  );
}
