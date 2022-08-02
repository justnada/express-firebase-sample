import { initializeApp } from "firebase/app";

const firebaseConfig = {
  databaseURL: "https://rest-sample-4f56f-default-rtdb.firebaseio.com",
};

const fire = initializeApp(firebaseConfig);

export default fire;
