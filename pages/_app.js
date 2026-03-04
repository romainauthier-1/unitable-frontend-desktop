import "../styles/globals.css";
import Head from "next/head";
<<<<<<< HEAD
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "../reducers/users";
import business from "../reducers/business";
import employee from "../reducers/employee";
const store = configureStore({
  reducer: { business,user, employee },
=======
import { Provider } from "react-redux";
import business from "../reducers/business";
import services from "../reducers/services";
// Imports redux-persist
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ business, services });

const persistConfig = { key: "UniTable MVP", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
>>>>>>> services
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {


  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <title>UniTable Admin</title>
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
