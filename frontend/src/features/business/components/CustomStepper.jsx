import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

const PRIMARY_COLOR = "#1E9BCD";

export default function CustomStepper({ steps, activeStep, changeStep }) {
  const handleStepClick = (index) => {
    changeStep(index);
  };

  return (
    <Box sx={{ width: "100%", padding: "24px" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.title}>
            <StepButton onClick={() => handleStepClick(index)}>
              <StepLabel
                sx={{
                  cursor: "pointer",
                  "& .MuiStepIcon-root": {
                    "&.Mui-active": {
                      color: PRIMARY_COLOR,
                    },
                    "&.Mui-completed": {
                      color: PRIMARY_COLOR,
                    },
                  },
                  "& .MuiStepLabel-label": {
                    "&.Mui-active": {
                      color: PRIMARY_COLOR,
                      fontWeight: "bold",
                    },
                    "&.Mui-completed": {
                      color: "rgba(0, 0, 0, 0.6)",
                    },
                  },
                }}
              >
                {step.title}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
