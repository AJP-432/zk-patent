<script lang="ts">
	import About from '$lib/components/About.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MintLogs from '$lib/components/MintLogs.svelte';
</script>

<div class="flex h-screen flex-col">
	<Header />

	<main class="flex-1 overflow-y-auto p-8">
		<div class="mx-auto w-full max-w-6xl space-y-24">
			<About />
			<MintLogs />
		</div>
	</main>

	<Footer />
</div>
