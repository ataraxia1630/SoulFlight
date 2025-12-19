import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { activityAPI, itineraryAPI } from "../services/itinerary.service";

export const useItinerary = (itineraryId = null) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadItinerary = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await itineraryAPI.getById(id);
        setItinerary(data);
        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load itinerary");
        enqueueSnackbar("Không thể tải lịch trình", { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  const generateItinerary = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await itineraryAPI.generate(formData);
        console.log(result);
        setItinerary(result);
        enqueueSnackbar("Tạo lịch trình thành công!", { variant: "success" });
        return result;
      } catch (err) {
        const errorMsg = err.response?.data?.error || "Failed to generate itinerary";
        setError(errorMsg);
        enqueueSnackbar(errorMsg, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  const updateItinerary = useCallback(
    async (id, updates) => {
      try {
        const result = await itineraryAPI.update(id, updates);
        setItinerary(result.itinerary);
        enqueueSnackbar("Cập nhật thành công", { variant: "success" });
        return result.itinerary;
      } catch (err) {
        enqueueSnackbar("Cập nhật thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const deleteItinerary = useCallback(
    async (id) => {
      try {
        await itineraryAPI.delete(id);
        enqueueSnackbar("Đã xóa lịch trình", { variant: "success" });
        return true;
      } catch (err) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (itineraryId) {
      loadItinerary(itineraryId);
    }
  }, [itineraryId, loadItinerary]);

  return {
    itinerary,
    loading,
    error,
    loadItinerary,
    generateItinerary,
    updateItinerary,
    deleteItinerary,
    setItinerary,
  };
};

export const useActivity = () => {
  const { enqueueSnackbar } = useSnackbar();

  const addActivity = useCallback(
    async (dayId, activityData) => {
      try {
        const result = await activityAPI.add(dayId, activityData);
        enqueueSnackbar("Đã thêm hoạt động", { variant: "success" });
        console.log(result);
        return result.activity;
      } catch (err) {
        enqueueSnackbar("Thêm hoạt động thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const updateActivity = useCallback(
    async (activityId, updates) => {
      try {
        const result = await activityAPI.update(activityId, updates);
        enqueueSnackbar("Cập nhật hoạt động thành công", {
          variant: "success",
        });
        return result.activity;
      } catch (err) {
        enqueueSnackbar("Cập nhật thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const deleteActivity = useCallback(
    async (activityId) => {
      try {
        await activityAPI.delete(activityId);
        enqueueSnackbar("Đã xóa hoạt động", { variant: "success" });
        return true;
      } catch (err) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const getAlternatives = useCallback(
    async (activityId) => {
      try {
        const result = await activityAPI.getAlternatives(activityId);
        return result.alternatives;
      } catch (err) {
        enqueueSnackbar("Không thể tải gợi ý thay thế", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const replaceActivity = useCallback(
    async (activityId, newActivityData) => {
      try {
        const result = await activityAPI.replace(activityId, newActivityData);
        enqueueSnackbar("Đã thay thế hoạt động", { variant: "success" });
        return result.activity;
      } catch (err) {
        enqueueSnackbar("Thay thế thất bại", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  const getReviews = useCallback(
    async (activityId) => {
      try {
        const result = await activityAPI.getReviews(activityId);
        return result.reviews;
      } catch (err) {
        enqueueSnackbar("Không thể tải đánh giá", { variant: "error" });
        throw err;
      }
    },
    [enqueueSnackbar],
  );

  return {
    addActivity,
    updateActivity,
    deleteActivity,
    getAlternatives,
    replaceActivity,
    getReviews,
  };
};
