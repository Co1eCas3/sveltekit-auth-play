<script>
	import { fly } from 'svelte/transition';

	import { message } from '$lib/stores/message';

	let messageContHeight;
</script>

{#if $message}
	<div
		class="center-children"
		bind:clientHeight={messageContHeight}
		transition:fly={{ y: messageContHeight, duration: 450 }}
		on:click={message.close}
	>
		{@html $message}
		<span>X</span>
	</div>
{:else}
	<div style="display: none;" />
{/if}

<style>
	div {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 4rem;
		background: #7a1f1f;
		color: #cdcdcd;
		text-align: center;
	}

	span {
		position: absolute;
		right: 3%;
		cursor: pointer;
	}
</style>
