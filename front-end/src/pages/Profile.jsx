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
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <img src={user.picture} alt={user.name} />
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      </div>
    )
  );
};

export default Profile;
