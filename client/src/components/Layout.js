import {useContext} from "react";
import {Link, Outlet} from "react-router-dom";
import AuthContext from "./AuthContext";

export default function Layout() {
  const auth = useContext(AuthContext);

  return (
    <div className="max-w-md mx-auto pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full border-b z-10 bg-white/80">
        <ul className="flex">
          <li>
            <Link to="/" className="block p-2">Home</Link>
          </li>
          <li>
            <Link to="/articles" className="block p-2">Explore</Link>
          </li>
          <li>
            <Link to="/create" className="block p-2">Create</Link>
          </li>
          <li>
            <Link to={`/profile/${auth.user.username}`} className="block p-2">Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Children route  */}
      <Outlet />
    </div>
  )
}