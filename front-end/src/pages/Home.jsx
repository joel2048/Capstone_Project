import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

function Home() {
  return (
    <>
    <div>
        <p>Home</p>
        <LoginButton/>
        <LogoutButton/>
    </div>
    </>
  );
}

export default Home;
