import { SignUp } from "@/components/clerk/SignUp";
import React from "react";

const SignUpComponent = () => {
  return <SignUp signInUrl="/sign-in" scheme="medisync" />;
};

export default SignUpComponent;
