<script>
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Content from './Content.svelte'
	export let name;
</script>


<main>
	<Navbar/>
	<Hero/>
	<Content/>
</main>

<style>
	:global(body) { 
		margin:0;
		padding: 0;
		background-color: rgb(54,54,54);
	}

	main {
		padding:0;
		margin:0;
		width:100%;
		height:100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>