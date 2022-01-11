<script>
	import RequestHelper from './helpers/request-helper';
	import { QUERIES } from './helpers/queries';
	import { movies, token, is_auth, user, is_online, is_displayed } from './store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import auth from './auth';
	import { Stretch } from 'svelte-loading-spinners';

	window.onoffline = () => {
		$is_online = false;
	};

	window.ononline = () => {
		$is_online = true;
	};

	window.onload = async () => {
		if ($is_auth) {
			const { movies_movies } = await RequestHelper.startFetchMyQuery(QUERIES.QUERY_Get_All());
			$movies = movies_movies;
		}
	}

	token.subscribe(async (token_value) => {
		if (token_value !== "") {
			const { movies_movies } = await RequestHelper.startFetchMyQuery(QUERIES.QUERY_Get_All());
			$movies = movies_movies;
		}
	});

	let auth0Client;

	onMount(async () => {
		auth0Client = await auth.createClient();
		$is_auth = await auth0Client.isAuthenticated();
		const access_token = await auth0Client.getIdTokenClaims();

		if (access_token) {
			$token = access_token._raw;
		}
		$user = await auth0Client.getUser();
	});

	async function login() {
		await auth.loginWithPopup(auth0Client);
	}

	function logout() {
		$token = '';
		auth.logout(auth0Client);
	}

	const AddMovie = async () => {
		const name = document.getElementById('name').value;
		const director = document.getElementById('director').value;
		const budget = convertToNumber(document.getElementById('budget').value);
		const gross = convertToNumber(document.getElementById('gross').value);

		if (!name) {
			return;
		}

		try {
			$is_displayed = true;

			const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Insert(name,director, budget, gross));

			$is_displayed = false;

			movies.update(n => [...n, res.insert_movies_movies.returning[0]])
		} catch (e) {
			console.error(e);
		}
	};

	const DeleteMovie = async () => {
		if (is_auth) {
			const title = document.getElementById('delete_name').value;
			if (!title) {
				return;
			}
			try {
				$is_displayed = true;

				const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Delete(title));

				$is_displayed = false;

				movies.update(n => [...n.filter(item => item.title != title)]);
			} catch (e) {
				console.error(e);
			}
		}
	}

	const convertToNumber = (string) => {
		return isNaN(+string) ? 0 : +string;
	};
</script>

<main>
	{#if !$is_online}
		<div>Offline</div>
	{:else if !$is_auth}
		<button on:click={login}>Login</button>
	{:else}
		<button on:click={logout}>Logout</button>
		<div class="input_block">
			<input placeholder="Name" id="name">
			<input placeholder="Director" id="director">
			<input placeholder="Budget" id="budget">
			<input placeholder="Gross" id="gross">
			<button on:click={AddMovie}>Add movie</button>
		</div>
		<div class="delete_block">
			<input placeholder="Name" id="delete_name" class="delete_name">
			<button on:click={DeleteMovie}>Delete movie</button>
		</div>
		<table border="1">
			<caption>Movies</caption>
			<tr>
				<th>Name</th>
				<th>Director</th>
				<th>Budget</th>
				<th>Gross</th>
			</tr>
			{#each $movies as movie}
				<tr>
					<td>{movie.title}</td>
					<td>{movie.director}</td>
					<td>{movie.budget}</td>
					<td>{movie.gross}</td>
				</tr>
			{/each}
		</table>
		<div class={$is_displayed ? "display_block" : "dislpay_none"}>
			<Stretch />
		</div>
	{/if}
</main>

<style>
:root {
	--green-color: #01ac2c;
	--purple-color: #7200c2;
}

.input_block {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.delete_block {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

button {
	background-color: var(--green-color);
}

table {
	width: 100%;
}

tr:nth-child(even) {
	background-color: var(--green-color);
}

tr:nth-child(odd) {
	background-color: var(--purple-color);
}

.display_block {
	display: block;
}

.dislpay_none {
	display: none;
}
</style>
