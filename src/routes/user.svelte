<script>
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authorization } from '$lib/stores/authorization';

	onMount(() => {
		if (!$authorization) {
			window.dispatchEvent(new CustomEvent('unauthorized'));
			goto('/login', { replaceState: true });
		}
	});

	console.log($session);
</script>

<section>
	<h1>{`${$session.user.name}'s Profile!`}</h1>
</section>
