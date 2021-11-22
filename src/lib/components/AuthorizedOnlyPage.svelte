<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authorization } from '$lib/stores/authorization';

	export let className = null;

	onMount(async () => {
		if (!$authorization) {
			try {
				const nav = await goto('/login', { replaceState: true });
				console.log(nav);
				// window.dispatchEvent(new CustomEvent('unauthorized'));
			} catch (err) {
				console.log(err);
			}
		}
	});
</script>

<section class:className>
	<slot />
</section>
