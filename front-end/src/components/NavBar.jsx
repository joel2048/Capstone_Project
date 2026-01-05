import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import "../index.css";

function NavBar() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  return (
    <>
    
        <header className="shadow-xl fixed left-4 right-4 w-auto z-50 container flex justify-between items-center px-6 py-2 rounded-lg bg-stone-500">
          <nav className="text-xl space-x-5">
            <Link to="/"
            className="my-button"
            >Home</Link>

            <Link to="/Collections"
            className="my-button"
            >Collections</Link>

            <Link to="/Dictionary"
            className="my-button"
            >Dictionary</Link>

            <Link to="/Statistics"
            className="my-button">
            Statistics</Link>
          </nav>
        <div className="flex space-x-2">
        {isAuthenticated && user?.picture && (
        <Link to="/Profile">
            <img
            src={user.picture}
            alt={"User"}
            className="w-10 h-10 rounded-full hover:opacity-70 active:scale-75 transition"
            />
        </Link>
        )}
            { !isAuthenticated ? <LoginButton isLoading={isLoading} /> : <LogoutButton isLoading={isLoading}/> }
        </div>
        </header>
    </>
  );
}

export default NavBar;
