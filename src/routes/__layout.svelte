<script>
	import { session } from '$app/stores';
	import { onMount } from 'svelte';
	import '../app.css';

	import { token } from '$lib/stores/token.js';

	import Header from '$lib/components/Header.svelte';

	let refreshingAuthToken = false;

	onMount(async () => {
		console.log('mounting main layout');
		console.log('checking auth status');
		if (!$token && $session.refreshReady) {
			console.log('layout trying refresh');
			refreshingAuthToken = true;
			const refreshRes = await fetch('/api/auth/refresh.json', {
				method: 'GET',
				mode: 'no-cors'
			});

			const data = await refreshRes.json();
			if (refreshRes.ok) {
				token.set(data.token);
				$session.user = data.user;
			} else {
				$session.authError = data;
			}
		} else if ($session.authError) {
			console.log($session.authError);
		}

		refreshingAuthToken = false;
	});
</script>

{#if refreshingAuthToken}
	<div class="center-children">Authorizing...</div>
{/if}

<Header />
<main class="center-children">
	<slot />
</main>

<style>
	div {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2rem;
		background: red;
		color: white;
	}

	main {
		width: 100%;
		min-height: 100vh;
	}
</style>
