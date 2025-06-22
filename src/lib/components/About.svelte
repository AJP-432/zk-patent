<script lang="ts">
	// @ts-expect-error import about.svx not found, despite being in the project
	import AboutContent from '$lib/content/about.svx';
	import FileDropBox from './FileDropBox.svelte';
	import { ethers } from 'ethers';
	import { refreshSignal } from '$lib/stores';

	let loading = $state(false);
	let userAddress = $state<string | null>(null);

	// New state variables to hold structured success/error data
	let transactionHash = $state<string | null>(null);
	let tokenId = $state<string | null>(null);
	let contractAddress = $state<string | null>(null);

	let statusMessage = $state(''); // For general loading/processing messages
	let errorMessage = $state('');

	// Derived state for easy checks
	const hasSuccessData = $derived(
		transactionHash !== null && tokenId !== null && contractAddress !== null
	);

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
				console.log('Frontend wallet connected (NFT Recipient):', userAddress);
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
		// Clear previous success data
		transactionHash = null;
		tokenId = null;
		contractAddress = null;

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
				// Assign results to new state variables
				transactionHash = result.transactionHash;
				tokenId = result.tokenId;
				contractAddress = result.contractAddress;
				statusMessage = ''; // Clear general status message if success data is set

				// Trigger a refresh of the mint logs
				refreshSignal.update((n) => n + 1);

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
		<div class="hidden md:grid md:grid-cols-2 md:items-center md:gap-12">
			<div
				class="bg-background/20 h-80 rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-md"
			>
				<div class="flex flex-col items-center space-y-6">
					<div class="space-y-4 text-left">
						<AboutContent />
					</div>
				</div>
			</div>

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

					{#if statusMessage && !loading}
						<div class="mt-4 text-left text-sm text-green-400">{statusMessage}</div>
					{/if}
					{#if loading && statusMessage}
						<div class="mt-4 text-left text-sm text-green-400">{statusMessage}</div>
					{/if}
					{#if errorMessage}
						<p class="mt-4 text-sm text-red-400">{errorMessage}</p>
					{/if}

					{#if hasSuccessData}
						<div class="mt-4 text-left text-sm text-green-400">
							<p class="font-bold">Success! NFT (ID: {tokenId}) minted.</p>
							<a
								href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-400 hover:underline">View Transaction on Etherscan</a
							>
							<div class="mt-2 border-t border-white/20 pt-2">
								<p class="font-semibold">To add to your wallet:</p>
								<p>Contract: <span class="font-mono text-xs break-all">{contractAddress}</span></p>
								<p>Token ID: <span class="font-mono">{tokenId}</span></p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

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

						{#if statusMessage && !loading}
							<div class="mt-4 text-center text-sm text-green-400">{statusMessage}</div>
						{/if}
						{#if loading && statusMessage}
							<div class="mt-4 text-center text-sm text-green-400">{statusMessage}</div>
						{/if}
						{#if errorMessage}
							<p class="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
						{/if}

						{#if hasSuccessData}
							<div class="mt-4 text-center text-sm text-green-400">
								<p class="font-bold">Success! NFT (ID: {tokenId}) minted.</p>
								<a
									href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-400 hover:underline">View Transaction on Etherscan</a
								>
								<div class="mt-2 border-t border-white/20 pt-2">
									<p class="font-semibold">To add to your wallet:</p>
									<p>
										Contract: <span class="font-mono text-xs break-all">{contractAddress}</span>
									</p>
									<p>Token ID: <span class="font-mono">{tokenId}</span></p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
