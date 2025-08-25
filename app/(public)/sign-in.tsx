import SignIn from "@/components/clerk/SignIn";

import React from "react";

const index = () => {
  return (
    <>
    
      <SignIn signUpUrl="/sign-up" scheme="medisync" homeUrl="(protected)" />
    </>
  );
};

export default index;
