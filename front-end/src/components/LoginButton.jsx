import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();

  return <button disabled={props.isLoading} className="my-button" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;