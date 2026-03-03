import "../styles/globals.css";
import Head from "next/head";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "../reducers/users";
import business from "../reducers/business";
import employee from "../reducers/employee";
const store = configureStore({
  reducer: { business,user, employee },
});

function App({ Component, pageProps }) {


  return (
    <>
      <Provider store={store}>
        <Head>
          <title>UniTable Admin</title>
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
