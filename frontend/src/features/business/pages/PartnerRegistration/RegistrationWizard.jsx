// src/pages/RegistrationWizard.jsx

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomStepper from "../../components/CustomStepper";
import STEP_CONFIG from "./Steps/stepConfig";

const DEFAULT_MODEL = "FnB";

const RegistrationWizard = ({ defaultModel = DEFAULT_MODEL }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const model = STEP_CONFIG[defaultModel];
  const steps = model.steps;
  const CurrentStepComponent = steps[activeStep]?.component;

  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(getValidationSchema(steps[activeStep]?.id)),
  });

  const { handleSubmit } = methods;
  // const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    // const isValid = await trigger();
    const isValid = true;
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChangeStep = (index) => setActiveStep(index);

  const onSubmit = (data) => {
    console.log("Final data:", { model: DEFAULT_MODEL, ...data });
    alert("Đăng ký thành công! (Xem console)");
  };

  const isLastStep = activeStep === steps.length - 1;
  // const totalSteps = steps.length;

  if (!CurrentStepComponent) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box bgcolor="#f8f9fa" minHeight="100vh" py={4}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Button startIcon={<ArrowBack />} sx={{ color: "#6c757d", fontSize: "0.875rem" }}>
            Back to Select service model
          </Button>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                height: 40,
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              Previous Step
            </Button>
            <Button
              variant="contained"
              onClick={isLastStep ? handleSubmit(onSubmit) : handleNext}
              sx={{
                height: 40,
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              {isLastStep ? "Done" : "Next Step"}
            </Button>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={600} mb={1}>
          Partner Registration /{" "}
          <Box component="span" color={theme.palette.primary.main}>
            {model.name}
          </Box>
        </Typography>

        <Box mt={4} bgcolor="white" borderRadius={3} boxShadow="0 1px 3px rgba(0,0,0,0.1)">
          <CustomStepper steps={steps} activeStep={activeStep} changeStep={handleChangeStep} />
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              // bgcolor="white"
              // borderRadius={3}
              // boxShadow="0 1px 3px rgba(0,0,0,0.1)"
              p={6}
              minHeight="500px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <CurrentStepComponent />
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

// Validation per step
function getValidationSchema(stepId) {
  const schemas = {
    "service-info": yup.object({
      name: yup.string().required("Tên dịch vụ bắt buộc"),
      address: yup.string().required("Địa chỉ bắt buộc"),
      phone: yup.string().required("Số điện thoại bắt buộc"),
    }),
    // Thêm validation cho các step khác khi cần
  };
  return schemas[stepId] || yup.object({});
}

export default RegistrationWizard;
