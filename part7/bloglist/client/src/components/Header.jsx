import { Link } from "react-router-dom";

const Header = ({ user, handleLogout }) => {
  return (
    <div className="header">
      <h1>The Insightful Blogs</h1>
      {user && (
        <div className="header-user-info">
          <Link to="/blogs">Blogs</Link>
          <Link to="/users">Users</Link>
          <Link to="/new_blog">New blog</Link>
          <span>{user.name} is logged in</span>
          <button id="logout-button" onClick={handleLogout}>
            logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
