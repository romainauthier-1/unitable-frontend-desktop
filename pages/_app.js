import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Provider, useDispatch, useSelector } from "react-redux";
import business from "../reducers/business";
import services from "../reducers/services";
import employee from "../reducers/employee";
import user from "../reducers/users";
import instructions from "../reducers/instructions";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// Imports redux-persist
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { onboardingInfos } from "@/components/ModalOnboarding";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toggleInstructions } from "@/reducers/instructions";

// Test

const reducers = combineReducers({
	business,
	services,
	user,
	employee,
	instructions,
});

const persistConfig = { key: "UniTable MVP", storage };

const store = configureStore({
	reducer: persistReducer(persistConfig, reducers),
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function AppLayout({ Component, pageProps }) {
	const dispatch = useDispatch();
	const instructionStatus = useSelector((state) => state.instructions.value);
	const [checked, setChecked] = useState(false);

	const handleInstructions = () => {
		checked && dispatch(toggleInstructions(router.pathname));
	};
	const router = useRouter();
	const currentUser = useSelector((state) => state.user.value);
	const isAuthenticated = Boolean(currentUser?.token && currentUser?.email);
	const publicRoutes = [
		"/",
		"/login",
		"/signup",
		"/forgetPassword",
		"/sendEmailPassword",
	];

	useEffect(() => {
		if (!router.isReady) return;
		if (publicRoutes.includes(router.pathname)) return;
		if (!isAuthenticated) {
			router.replace("/login");
		}
	}, [isAuthenticated, router]);

	const routesWithoutSidebar = [
		"/",
		"/login",
		"/signup",
		"/businessForm",
		"/createEmployee",
		"/createTeams",
		"/services",
		"/templatePlanning",
		"/forgetPassword",
		"/sendEmailPassword",
	];
	const hideSidebarOnRoute = routesWithoutSidebar.includes(router.pathname);
	const showSidebar = isAuthenticated && !hideSidebarOnRoute;
	const currentInfo = onboardingInfos[router.pathname];
	const showInfos = currentInfo && instructionStatus[router.pathname];

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
			{showInfos && (
				<Dialog defaultOpen={true}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{currentInfo.title}</DialogTitle>
							<DialogDescription className="py-2 text-base text-slate-700 whitespace-pre-line">
								{currentInfo.description}
							</DialogDescription>
							<div className="bg-slate-50 p-4 rounded-md border-l-4 border-primary mt-2 ">
								<p className="text-sm font-semibold mb-1">
									Exemple:{" "}
								</p>
								<p className="text-sm italic text-slate-600 whitespace-pre-line">
									{currentInfo.exemple}
								</p>
							</div>
							{currentInfo.warning && (
								<p className="text-sm text-destructive font-medium mt-2 whitespace-pre-line">
									⚠️ {currentInfo.warning}
								</p>
							)}
							<div className="flex flex-row">
								<Checkbox
									checked={checked}
									onCheckedChange={setChecked}
									id="instructions"
									name="instructions"
								/>
								<Label htmlFor="instructions">
									Ne plus montrer
								</Label>
							</div>
						</DialogHeader>
						<DialogClose
							onClick={handleInstructions}
							className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
						>
							<p>Ok, compris !</p>
						</DialogClose>
					</DialogContent>
				</Dialog>
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
						<title>
							UniTable |{" "}
							{pageProps.title ? pageProps.title : "Bienvenue"}
						</title>
					</Head>
					<AppLayout Component={Component} pageProps={pageProps} />
				</PersistGate>
			</Provider>
		</>
	);
}

export default App;
