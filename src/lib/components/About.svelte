<script lang="ts">
	// @ts-expect-error import about.svx not found, despite being in the project
	import AboutContent from '$lib/content/about.svx';
	import FileDropBox from './FileDropBox.svelte';
	import { ethers } from 'ethers';

	let loading = $state(false);
	let userAddress = $state<string | null>(null);
	let statusMessage = $state('');
	let errorMessage = $state('');

	async function connectWallet() {
		errorMessage = '';
		statusMessage = '';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((window as any).ethereum) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const provider = new ethers.BrowserProvider((window as any).ethereum);
				const accounts = await provider.send('eth_requestAccounts', []);
				userAddress = accounts[0];
			} catch (error) {
				errorMessage = 'Failed to connect wallet.';
				console.error(error);
			}
		} else {
			errorMessage = 'MetaMask is not installed. Please install it to continue.';
		}
	}

	async function handleSubmit(file: File) {
		if (!userAddress) {
			errorMessage = 'Please connect your wallet first.';
			return;
		}

		loading = true;
		statusMessage = 'Processing... This may take a moment.';
		errorMessage = '';

		const formData = new FormData();
		formData.append('patent_document', file);
		formData.append('owner_address', userAddress);

		try {
			const response = await fetch('/api/submit', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				statusMessage = `Success! NFT minted. Transaction: ${result.transactionHash}. Idea: "${result.idea}"`;
				console.log('API Success:', result);
			} else {
				errorMessage = `Error: ${result.error}`;
				console.error('API Error:', result);
			}
		} catch (error) {
			errorMessage = 'An unexpected error occurred during submission.';
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<section id="about" class="flex items-center justify-center p-8 pt-28">
	<div class="mx-auto w-full max-w-6xl">
		<!-- Desktop: Side by side layout -->
		<div class="hidden md:grid md:grid-cols-2 md:items-center md:gap-12">
			<!-- Left: Glass card with content -->
			<div
				class="bg-background/20 h-80 rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-md"
			>
				<div class="flex flex-col items-center space-y-6">
					<div class="space-y-4 text-left">
						<AboutContent />
					</div>
				</div>
			</div>

			<!-- Right: File Dropbox -->
			<div class="flex items-center justify-center">
				<div
					class="bg-background/10 flex h-80 w-full flex-col items-center justify-center rounded-2xl backdrop-blur-sm"
				>
					{#if !userAddress}
						<button
							class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold"
							onclick={connectWallet}>Connect Wallet to Start</button
						>
					{:else}
						<FileDropBox
							{loading}
							onSubmit={handleSubmit}
							onError={(msg) => (errorMessage = msg)}
						/>
					{/if}

					{#if statusMessage}
						<p class="mt-4 text-sm text-green-400">{statusMessage}</p>
					{/if}
					{#if errorMessage}
						<p class="mt-4 text-sm text-red-400">{errorMessage}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Mobile: Stacked layout (no 3D object) -->
		<div class="md:hidden">
			<div
				class="bg-background/20 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-md"
			>
				<div class="flex flex-col items-center space-y-6">
					<div class="space-y-4 text-left">
						<AboutContent />
					</div>
					<div class="w-full">
						{#if !userAddress}
							<button
								class="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-6 py-3 font-semibold"
								onclick={connectWallet}>Connect Wallet to Start</button
							>
						{:else}
							<FileDropBox
								{loading}
								onSubmit={handleSubmit}
								onError={(msg) => (errorMessage = msg)}
							/>
						{/if}

						{#if statusMessage}
							<p class="mt-4 text-center text-sm text-green-400">{statusMessage}</p>
						{/if}
						{#if errorMessage}
							<p class="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
