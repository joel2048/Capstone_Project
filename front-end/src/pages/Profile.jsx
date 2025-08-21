import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Auth0 User ID: {user.sub}</p> {/* <-- This is your unique Auth0 ID */}
      </div>
    )
  );
};

export default Profile;
