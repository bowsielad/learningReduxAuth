import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>Welcome to Redux Auth</h1>
      </header>
      <main>
        <p>I am learning how to use redux for authorization and persisting state</p>
        <p>&nbsp;</p>
        <address>
          Ryan Bowers
          <br />
          <Link to="/login">Login</Link>
        </address>
      </main>
      <footer>
        <a href="https://www.bowsiedesign.com/">www.bowsiedesign.com</a>
      </footer>
    </section>
  );
  return content;
};
export default Public;
