import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Provider, useSelector } from "react-redux";
import business from "../reducers/business";
import services from "../reducers/services";
import employee from "../reducers/employee";
import user from "../reducers/users";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Imports redux-persist
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ business, services, user, employee });

const persistConfig = { key: "UniTable MVP", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function AppLayout({ Component, pageProps }) {
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.value);
  const isAuthenticated = Boolean(currentUser?.token && currentUser?.email);
  const routesWithoutSidebar = [
    "/",
    "/login",
    "/signup",
    "/forgetPassword",
    "/sendEmailPassword",
  ];
  const hideSidebarOnRoute = routesWithoutSidebar.includes(router.pathname);
  const showSidebar = isAuthenticated && !hideSidebarOnRoute;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      {showSidebar ? (
        <>
          <AppSidebar variant="inset" user={currentUser} />
          <SidebarInset>
            <Component {...pageProps} />
          </SidebarInset>
        </>
      ) : (
        <Component {...pageProps} />
      )}
    </SidebarProvider>
  );
}

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <title>UniTable Admin</title>
          </Head>
          <AppLayout Component={Component} pageProps={pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
