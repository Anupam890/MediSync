import { SignUp } from "@/components/clerk/SignUp";
import React from "react";

const SignUpComponent = () => {
  return <SignUp signInUrl="/" scheme="medisync" homeUrl="(protected)" />;
};

export default SignUpComponent;
