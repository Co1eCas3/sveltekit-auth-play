<script>
	import { session } from '$app/stores';

	import AuthorizedOnlyPage from '$lib/components/AuthorizedOnlyPage.svelte';
</script>

<AuthorizedOnlyPage className="page-cont">
	<h1>Profile</h1>
</AuthorizedOnlyPage>

<style>
	:global(.page-cont) {
		width: 100%;
		justify-self: flex-start;
	}
</style>
