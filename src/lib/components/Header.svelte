<script>
	import { authorization } from '$lib/stores/authorization';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import LogoutBtn from '$lib/components/LogoutBtn.svelte';

	let loginBtnChecked;
</script>

<header>
	<div class="btn-cont center-children" class:loginBtnChecked>
		{#if !$authorization}
			<input type="checkbox" id="login-btn" bind:checked={loginBtnChecked} />
			<label for="login-btn" class="center-children">LOGIN</label>
			{#if loginBtnChecked}
				<div class="login-form-cont">
					<LoginForm />
				</div>
			{/if}
		{:else}
			<LogoutBtn />
		{/if}
	</div>
</header>

<style>
	header {
		width: 100%;
		height: 5.5rem;
		padding: 0 2.2rem;
		border-bottom: 1px solid #232323;
		box-shadow: 0 8px 6px -6px rgba(22, 22, 22, 0.2);
		display: flex;
		justify-content: flex-end;
		place-items: center;
	}

	.btn-cont {
		position: relative;
		width: fit-content;
		height: 3.5rem;
		border: 1px solid #232323;
		border-radius: 12px;
		padding: 0.25rem 1.5rem;
	}

	.btn-cont.loginBtnChecked {
		border-radius: 12px 12px 0 0;
	}

	input {
		display: none;
	}

	label {
		width: 100%;
		height: 100%;
		font-size: 2rem;
	}

	.login-form-cont {
		position: absolute;
		top: 100%;
		right: 0;
		width: 25rem;
		border-radius: 12px 0 12px 12px;
		padding: 2rem 3rem;
		background: #ddd;
	}
</style>
