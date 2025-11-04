import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomStepper from "../../components/CustomStepper";
import { defaultFormValues } from "./Steps/defaultValues";
import STEP_CONFIG from "./Steps/stepConfig";
import { fullSchema } from "./Steps/validationSchemas";

const RegistrationWizard = ({ defaultModel }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const model = STEP_CONFIG[defaultModel];
  const steps = model.steps;
  const CurrentStepComponent = steps[activeStep]?.component;

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaultFormValues,
      model: defaultModel.toLowerCase(),
    },
    resolver: yupResolver(fullSchema),
  });

  const { handleSubmit, trigger, watch } = methods;
  const _formData = watch();

  const handleNext = async () => {
    const fieldsToValidate = steps[activeStep]?.fields || [];
    console.log(fieldsToValidate);
    const isStepValid = await trigger(fieldsToValidate);
    console.log("→ Valid?", isStepValid);
    if (!isStepValid) {
      const errors = methods.formState.errors;
      console.log("Validation errors:", errors);
    }

    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChangeStep = (index) => setActiveStep(index);

  const onSubmit = (data) => {
    console.log("Final data:", { model: defaultModel, ...data });
    alert("Đăng ký thành công! (Xem console)");
  };

  const isLastStep = activeStep === steps.length - 1;

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

        <Box mt={4} bgcolor="white" borderRadius={3}>
          <CustomStepper steps={steps} activeStep={activeStep} changeStep={handleChangeStep} />
        </Box>

        <Box mt={4} width="100%">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" width="100%">
                <CurrentStepComponent />
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Container>
    </Box>
  );
};

export default RegistrationWizard;
