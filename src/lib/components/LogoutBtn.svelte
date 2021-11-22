<script>
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authorization } from '$lib/stores/authorization';
	import { message } from '$lib/stores/message';

	async function logout(e) {
		await authorization.revoke($session.user.email);
		$session.user = null;
		await goto('/');
		message.showNClose('Logged out! Come back soon!');
	}
</script>

<button class="center-children" on:click={logout}>LOGOUT</button>

<style>
	button {
		width: 100%;
		height: 100%;
		border: none;
		font-size: 2rem;
		margin: 0 auto;
		cursor: pointer;
	}
</style>
