import AddMenuStep from "./AddMenuStep";
import AddRoomStep from "./AddRoomStep";
import ModelTagStep from "./ModelTagStep";
import ServiceInfoStep from "./ServiceInfoStep";
import ServiceTagStep from "./ServiceTagStep";

// config các step cho từng model (theo thứ tự)
const STEP_CONFIG = {
  Stay: {
    name: "Stay Model",
    steps: [
      {
        id: "service-info",
        component: ServiceInfoStep,
        title: "Service Info",
        fields: ["serviceName", "location.lat", "location.lng"],
      },
      {
        id: "model-tag",
        component: ModelTagStep,
        title: "Model Tag",
        fields: ["modelTag"],
      },
      {
        id: "service-tags",
        component: ServiceTagStep,
        title: "Service Tags",
      },
      { id: "rooms", component: AddRoomStep, title: "Add Rooms" },
    ],
  },
  FnB: {
    name: "F&B Model",
    steps: [
      {
        id: "service-info",
        component: ServiceInfoStep,
        title: "Service Info",
      },
      {
        id: "model-tag",
        component: ModelTagStep,
        title: "Model Tag",
      },
      {
        id: "service-tags",
        component: ServiceTagStep,
        title: "Service Tags",
      },
      { id: "menus", component: AddMenuStep, title: "Add Menus" },
    ],
  },
};

export default STEP_CONFIG;
