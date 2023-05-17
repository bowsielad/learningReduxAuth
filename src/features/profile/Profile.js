import { useGetProfileQuery } from "./profileApiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUserId } from "../auth/authSlice";

const Profile = () => {
  const userId = useSelector(selectCurrentUserId);
  const { data: userProfile, isLoading, isSuccess, isError, error } = useGetProfileQuery(userId);

  const profileItem = userProfile?.response?.result?.profile;

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <section className="users">
        <h1>Profile</h1>

        <div>
          <p>First Name: {profileItem?.first_name}</p>
          <p>Last Name: {profileItem?.last_name}</p>
          <p>Username: {profileItem?.username}</p>
          <p>Email: {profileItem?.email}</p>
          <p>Phone Number: {profileItem?.phone_number}</p>
          <p>ID: {profileItem?.id}</p>
        </div>

        <Link to="/welcome">Back to Welcome</Link>
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};

export default Profile;
