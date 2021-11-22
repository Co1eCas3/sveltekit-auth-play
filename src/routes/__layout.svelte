<script>
	import '../app.css';

	import cookie from 'cookie';
	import { session } from '$app/stores';
	import { onMount } from 'svelte';

	import { authorization } from '$lib/stores/authorization.js';
	import { message } from '$lib/stores/message.js';

	import AuthorizationMessage from '$lib/components/AuthorizationMessage.svelte';
	import Header from '$lib/components/Header.svelte';

	onMount(async () => {
		const cookies = cookie.parse(document.cookie);
		const knownUser = Boolean(cookies.user);

		if (!$authorization && knownUser) {
			message.show('Attempting to authorize...');
			const refreshRes = await authorization.refresh();

			if (refreshRes.ok) {
				$session.user = refreshRes.user;
				message.showNClose(`Weclome ${$session.user.name || 'user'}!!`);
			} else {
				message.showNClose(`Authorization error: ${refreshRes.authError}<br/>Please login again`);
			}
		}
	});
</script>

<Header />
<main class="center-children">
	<slot />
</main>

<AuthorizationMessage />

<style>
	main {
		width: 100%;
		min-height: calc(100vh - 5.5rem);
	}
</style>
