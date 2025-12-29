import { AttachMoney, CheckCircle, LocationOn, People, Schedule } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ServiceInfo = ({ service, type }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderRoomInfo = () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Mô tả
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {service.description || "Không có mô tả"}
        </Typography>
      </Box>

      <Divider />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Loại giường
          </Typography>
          <Typography variant="body1">{service.bed_number} giường</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Số khách tối đa
          </Typography>
          <Typography variant="body1">
            {service.max_adult_number} người lớn, {service.max_children_number} trẻ em
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            View
          </Typography>
          <Typography variant="body1">{service.view_type || "Không có thông tin"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Cho phép thú cưng
          </Typography>
          <Chip
            label={service.pet_allowed ? "Có" : "Không"}
            color={service.pet_allowed ? "success" : "default"}
            size="small"
          />
        </Grid>
      </Grid>
    </Stack>
  );

  const renderTourInfo = () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Mô tả chuyến đi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {service.description || "Không có mô tả"}
        </Typography>
      </Box>

      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <Schedule color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Thời gian
              </Typography>
              <Typography variant="body1">
                {new Date(service.start_time).toLocaleString("vi-VN")} -
                {new Date(service.end_time).toLocaleString("vi-VN")}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <People color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Số người
              </Typography>
              <Typography variant="body1">
                {service.current_bookings}/{service.max_participants} người
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {service.TourPlace && service.TourPlace.length > 0 && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6" gutterBottom>
              Lịch trình
            </Typography>
            <List>
              {service.TourPlace.map((place, idx) => (
                <ListItem key={place} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={place.Place?.name || `Điểm ${idx + 1}`}
                    secondary={
                      <>
                        {place.description && (
                          <Typography variant="body2" color="text.secondary">
                            {place.description}
                          </Typography>
                        )}
                        {place.start_time && place.end_time && (
                          <Typography variant="caption" color="text.secondary">
                            {place.start_time} - {place.end_time}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Stack>
  );

  const renderTicketInfo = () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Thông tin vé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {service.description || "Không có mô tả"}
        </Typography>
      </Box>

      <Divider />

      {service.Place && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Địa điểm
          </Typography>
          <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
            <LocationOn color="action" />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {service.Place.name}
              </Typography>
              {service.Place.address && (
                <Typography variant="body2" color="text.secondary">
                  {service.Place.address}
                </Typography>
              )}
            </Box>
          </Box>

          {service.Place.opening_hours && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Schedule color="action" />
              <Typography variant="body2" color="text.secondary">
                {typeof service.Place.opening_hours === "string"
                  ? service.Place.opening_hours
                  : JSON.stringify(service.Place.opening_hours)}
              </Typography>
            </Box>
          )}

          {service.Place.entry_fee && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <AttachMoney color="action" />
              <Typography variant="body2" color="text.secondary">
                Phí vào cửa thông thường: {service.Place.entry_fee.toLocaleString("vi-VN")} ₫
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );

  const renderMenuInfo = () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Về nhà hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {service.description || "Không có mô tả"}
        </Typography>
      </Box>

      <Divider />

      <Grid container spacing={2}>
        {service.location && (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn color="action" />
              <Typography variant="body2">{service.location}</Typography>
            </Box>
          </Grid>
        )}
        {service.price_min && service.price_max && (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoney color="action" />
              <Typography variant="body2">
                Giá: {service.price_min.toLocaleString("vi-VN")} -{" "}
                {service.price_max.toLocaleString("vi-VN")} ₫
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  );

  const renderAmenities = () => {
    const amenities = service.facilities || service.amenities || [];

    if (type === "ROOM" && service.facilities) {
      return (
        <List>
          {service.facilities.map((facility, _idx) => (
            <ListItem key={facility} sx={{ pl: 0 }}>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={facility.name || facility} />
            </ListItem>
          ))}
        </List>
      );
    }

    if (amenities.length > 0) {
      return (
        <List>
          {amenities.map((amenity, _idx) => (
            <ListItem key={amenity} sx={{ pl: 0 }}>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={amenity.name || amenity} />
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary">
        Không có thông tin tiện nghi
      </Typography>
    );
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
        <Tab label="Thông tin" />
        {type === "ROOM" && <Tab label="Tiện nghi" />}
      </Tabs>
      <CardContent>
        {activeTab === 0 && (
          <>
            {type === "ROOM" && renderRoomInfo()}
            {type === "TOUR" && renderTourInfo()}
            {type === "TICKET" && renderTicketInfo()}
            {type === "MENU_ITEM" && renderMenuInfo()}
          </>
        )}
        {activeTab === 1 && renderAmenities()}
      </CardContent>
    </Card>
  );
};

export default ServiceInfo;
