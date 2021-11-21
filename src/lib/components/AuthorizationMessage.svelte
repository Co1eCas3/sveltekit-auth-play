<script>
	import { session } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let messageContHeight, curMessage;

	const messages = {
		authorizationAttempt: () => 'Attempting authorization...',
		authorized: () => `Welcome ${$session.user ? $session.user.name : 'user'}!!`,
		authorizationFailed: (message) =>
			`Authorization error: ${message || 'unknown'}<br/>Please login again`,
		unauthorized: () => 'Please login to view this content',
		deauthorized: () => 'Logged out! See you soon!'
	};

	onMount(() => {
		Object.keys(messages).forEach((type) => {
			if (type === 'authorizationAttempt') window.addEventListener(type, show);
			else window.addEventListener(type, close);
		});
	});

	function show(e) {
		curMessage = messages[e.type](e.detail ? e.detail.message : null);
	}
	function close(e) {
		show(e);
		setTimeout(() => (curMessage = null), 3500);
	}
</script>

{#if curMessage}
	<div
		class="center-children"
		bind:clientHeight={messageContHeight}
		transition:fly={{ y: messageContHeight, duration: 450 }}
	>
		{@html curMessage}
	</div>
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
</style>
