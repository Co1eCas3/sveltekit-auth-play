<script>
	import { page, session } from '$app/stores';
	import { onMount } from 'svelte';

	import { token } from '$lib/stores/token';

	import LoginForm from '$lib/components/LoginForm.svelte';

	onMount(async () => {
		if (!$token && $page.query) {
			const loginToken = $page.query.get('token');

			const res = await fetch(`/api/auth/login.json?token=${loginToken}`);
			console.log(res);
			const data = await res.json();

			if (res.ok) {
				token.set(data.token);
				$session.user = data.user;
			} else {
				$session.authError = {
					error: data.error || {},
					message: data.message || 'Could not login'
				};
			}
		}
	});
</script>

<section class="center-children">
	<div class="top center-children">
		{#if !$token}
			<LoginForm />
		{:else}
			<h1>Logged in!</h1>
		{/if}
	</div>
	<div class="bottom center-children">
		<pre>
      {JSON.stringify($session)}
    </pre>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: calc(100vh - 5.5rem);
	}

	.top {
		width: 100%;
		height: 50%;
	}

	.bottom {
		width: 100%;
		height: 50%;
		justify-content: flex-start;
	}
</style>
