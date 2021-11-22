<script>
	import cookie from 'cookie';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { authorization } from '$lib/stores/authorization';

	import LoginForm from '$lib/components/LoginForm.svelte';
	import { message } from '$lib/stores/message';

	onMount(async () => {
		const loginToken = $page.query.get('token');

		if (!$authorization && loginToken) {
			message.show('Attempting to authorize...');
			const res = await authorization.get(loginToken);

			if (res.ok) {
				$session.user = res.user;

				const knownUserCookie = cookie.serialize('user', 'true', {
					path: '/',
					expires: new Date(2038, 11, 31)
				});
				document.cookie = knownUserCookie;

				await goto('/user', { replaceState: true });
				message.showNClose(`Welcome ${$session.user.name || 'user'}!!`);
			} else {
				await goto('/login', { replaceState: true });
				message.showNClose(`Authorization error: ${res.authError}<br/>Please login again`);
			}
		}
	});
</script>

<section class="center-children">
	<div class="top center-children">
		<LoginForm />
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
</style>
