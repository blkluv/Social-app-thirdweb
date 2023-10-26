import UserStatus from "../components/UserStatus";
import styles from "../styles/Home.module.css";

import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <UserStatus />
      </div>
    </main>
  );
};

export default Home;
