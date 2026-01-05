import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <>
    <div className="flex flex-col items-center justify-center space-y-4 mt-32">
        <p className="text-5xl">VocabAPP</p>
        <p className="text-5xl">単語アプリ</p>
        { !isAuthenticated ? <h1></h1> : <p>Welcome {user.name}</p> }
        <div className="flex space-x-2">
            { !isAuthenticated ? <LoginButton isLoading={isLoading} /> : <LogoutButton isLoading={isLoading}/> }
            
        </div>
    </div>
    </>
  );
}

export default Home;
