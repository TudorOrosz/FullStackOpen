const User = ({ user }) => {
  return (
    <div>
      {user.name} {user.username} {user.blogs.length}
    </div>
  );
};

export default User;
