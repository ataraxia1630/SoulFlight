import { Route } from "react-router-dom";
import CompleteProfileBusinessPage from "@/shared/pages/CompleteProfileBusinessPage";
import CompleteProfileTravelerPage from "@/shared/pages/CompleteProfileTravelerPage";
import CreateAccountPage from "@/shared/pages/CreateAccountPage";
import SignupPage from "@/shared/pages/SignupPage";
import VerifyOTPPage from "@/shared/pages/VerifyOTPPage";

const componentMap = {
  CompleteProfileBusinessPage,
  CompleteProfileTravelerPage,
};

export const createAuthRoutes = ({ userType, CompleteProfilePage }) => {
  const CompleteProfileComponent = componentMap[CompleteProfilePage];

  return (
    <>
      <Route path={`${userType}/signup`} element={<SignupPage userType={userType} />} />
      <Route path={`${userType}/verify-otp`} element={<VerifyOTPPage userType={userType} />} />
      <Route
        path={`${userType}/create-account`}
        element={<CreateAccountPage userType={userType} />}
      />
      <Route path={`${userType}/complete-profile`} element={<CompleteProfileComponent />} />
    </>
  );
};
