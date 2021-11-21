<script>
	import isEmail from 'validator/lib/isEmail';
	import { authorization } from '$lib/stores/authorization';

	let email = '';
	let hasUnfocusedInput = false;
	$: emailIsValid = isEmail(email);
	$: showEmailError = hasUnfocusedInput && !emailIsValid;

	let reqInProg = false;
	let linkSent = false;
	let error = '';

	async function getLoginLink(e) {
		e.preventDefault();

		if (!emailIsValid) return;
		reqInProg = true;

		const res = await authorization.request(email);
		const data = await res.json();

		linkSent = res.ok;
		error = data.message || null;
		// for demo purposes only,
		// actual app would not respond w/ a body on success
		console.log(data.loginLink);

		email = '';
		reqInProg = false;
	}
</script>

<form class="center-children" on:submit={getLoginLink}>
	<h3>Password-less login!</h3>
	<div class="center-children inp-cont">
		<input
			type="email"
			class:error={!emailIsValid}
			placeholder="you@site.com"
			novalidate
			bind:value={email}
			on:blur={() => (hasUnfocusedInput = true)}
		/>
		<button type="submit" class="center-children btn" disabled={!emailIsValid}>
			{reqInProg ? '...' : 'GO'}
		</button>
		{#if showEmailError && !linkSent}
			<small>Please enter a valid email</small>
		{/if}
	</div>
	{#if linkSent}
		<p>Link is on the way!</p>
		<small>(Actually, it's just in the console for now...)</small>
	{:else if error}
		<p>An error occurred :(</p>
		<small>{error}</small>
	{/if}
</form>

<style>
	form {
		width: 100%;
		height: 100%;
		padding: 1em 1.5em;
	}

	.inp-cont {
		flex-flow: row wrap;
		width: 100%;
		height: 2rem;
	}

	h3 {
		margin-bottom: 1em;
	}

	input {
		max-width: calc(100% - 3rem);
		height: 2rem;
		margin-right: 0;
		border-radius: 7px 0 0 7px;
		padding: 0.3em 0.5em;
		font-size: 1rem;
	}

	.btn {
		width: 3rem;
		height: 2rem;
		margin-left: 0;
		border-radius: 0 7px 7px 0;
		padding: 0.3rem 0.5rem;
		background: #232323;
		color: #cdcdcd;
		font-size: 1rem;
	}
</style>
