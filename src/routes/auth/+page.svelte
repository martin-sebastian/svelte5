<h1>Auth Home</h1>

<div>
	<a href="/auth/login">Login</a>
	<a href="/auth/register">Register</a>
</div>

<form method="POST" action="?/login">
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
	<button formaction="?/signup">Sign up</button>
</form>
