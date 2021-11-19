<script>
	import { session } from '$app/stores';
	import { token } from '$lib/stores/token';

	async function logout(e) {
		const res = await fetch('/api/auth/logout.json', {
			method: 'POST',
			mode: 'no-cors',
			body: JSON.stringify({ email: $session.user.email })
		});

		const data = res.json();

		if (res.ok) {
			token.unset();
		} else {
			console.log(data);
		}
	}
</script>

<button on:click={logout}>LOGOUT</button>
