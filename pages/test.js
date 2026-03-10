import React, { useEffect, useState } from "react";

function TestPage() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch("http://localhost:3000/users/search/all")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				if (data.result) {
					setUsers(data.users);
				}
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
			});
	}, []);

	const inviteUser = async (user) => {
		try {
			const res = await fetch("http://localhost:3000/emails/invitation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					toEmail: user.email,
					toName: user.firstName,
				}),
			});

			const data = await res.json();

			if (data.ok) {
				alert(`Invitation envoyée à ${user.email}`);
			} else {
				console.error(data);
				alert("Erreur lors de l'envoi de l'email");
			}
		} catch (error) {
			console.error("Erreur :", error);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				{users.length === 0 && <p>Aucun utilisateur à afficher</p>}

				{users.map((user) => (
					<div key={user.id}>
						{user.email}
						<p>{user.firstConnection ? "Oui" : "Non"}</p>
						{user.firstConnection && (
							<button
								onClick={() => inviteUser(user)}
								className="mt-2 rounded bg-blue-500 px-3 py-1 text-white"
							>
								Inviter {user.firstName}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default TestPage;
