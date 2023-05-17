import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectCurrentuserName,
  selectCurrentUserId,
  selectCurrentToken,
  logOut,
} from "./authSlice";
import { add, sub, reset, fetchCount, updateCount } from "../counter/countSlice";
import { Link } from "react-router-dom";

const Welcome = () => {
  const user = useSelector(selectCurrentuserName);
  const userId = useSelector(selectCurrentUserId);
  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();
  const { count } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchCount());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(add(1));
    dispatch(updateCount(count));
  };

  const handleSub = () => {
    dispatch(sub(1));
    dispatch(updateCount(count));
  };

  const welcome = user ? `Welcome ${user}${userId}!` : "Welcome!";
  const tokenAbbr = `${token.slice(0, 9)}...`;

  const content = (
    <section className="welcome">
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>

      <br />

      <div>
        <h1>count: {count.value}</h1>
        <div>
          <button onClick={handleAdd}>add</button>
          <button onClick={handleSub}>sub</button>
          <button onClick={() => dispatch(reset())}>reset</button>
        </div>
      </div>

      <p>
        <Link to="/profile">Go to the Profile</Link>
      </p>

      <button onClick={() => dispatch(logOut())}>Log out</button>
    </section>
  );

  return content;
};
export default Welcome;
