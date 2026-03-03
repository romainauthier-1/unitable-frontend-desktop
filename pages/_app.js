import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import business from "../reducers/business";

const store = configureStore({
  reducer: { business },
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
