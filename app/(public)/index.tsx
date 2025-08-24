import SignIn from "@/components/clerk/SignIn";

import React from "react";

const index = () => {
  return <SignIn signUpUrl="/sign-up" scheme="medisync" />;
};

export default index;
