import { Link } from "react-router-dom";
import '../index.css'



function NavBar() {
    return(
    <nav>
        <Link to="/">Home</Link>
        <Link to="/CardSwipe">CardSwipe</Link>
        <Link to="/Collections">Collections</Link>
        <Link to="/Dictionary">Dictionary</Link>
        <Link to="/Profile">Profile</Link>
    </nav>
    )
}

export default NavBar;