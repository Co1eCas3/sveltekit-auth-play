<script>
	import { authorization } from '$lib/stores/authorization';

	export let className = null;
</script>

{#if $authorization}
	<div class:className>
		<slot />
	</div>
{/if}
