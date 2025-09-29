const useSocialAuth = () => {
  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  const handleXLogin = () => {
    console.log("X login");
  };

  return {
    handleGoogleLogin,
    handleFacebookLogin,
    handleXLogin,
  };
};

export default useSocialAuth;
