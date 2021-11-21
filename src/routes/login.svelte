<script>
	import cookie from 'cookie';
	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { authorization } from '$lib/stores/authorization';

	import LoginForm from '$lib/components/LoginForm.svelte';

	onMount(async () => {
		const loginToken = $page.query.get('token');

		if (!$authorization && loginToken) {
			window.dispatchEvent(new CustomEvent('authorizationAttempt'));
			const res = await authorization.get(loginToken);

			if (res.ok) {
				$session.user = res.user;
				window.dispatchEvent(new CustomEvent('authorized'));

				const knownUserCookie = cookie.serialize('user', 'true', {
					path: '/',
					expires: new Date(2038, 11, 31)
				});
				document.cookie = knownUserCookie;
				console.log(document.cookie);

				goto('/user', { replaceState: true });
			} else {
				window.dispatchEvent(new CustomEvent('authorizationFailed', { message: res.authError }));

				goto('/login', { replaceState: true });
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
