<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { refreshSignal } from '$lib/stores';

	type MintLog = {
		tokenId: string;
		transactionHash: string;
		blockNumber: number;
		minter: string;
	};

	// 1. Define component state using $state runes.
	// These are now reactive signals.
	let mintLogs: MintLog[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	// 2. Use the $effect rune to handle data loading.
	// This replaces both onMount and the $: block.
	$effect(() => {
		// This line creates a dependency on the refreshSignal store.
		// Whenever the store is updated elsewhere, this effect will re-run.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		$refreshSignal;

		// The effect also runs once when the component is first created.
		console.log('[UI] Effect triggered by rune. Reloading on-chain activity...');

		// We define and call an async function inside the effect to fetch data.
		const loadData = async () => {
			loading = true;
			error = null;
			try {
				const response = await fetch('/api/mint-logs?limit=5');
				const data = await response.json();

				if (response.ok && data.success) {
					mintLogs = data.patents;
				} else {
					throw new Error(data.error || 'Failed to fetch recent mints.');
				}
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unknown error occurred.';
				console.error(e);
			} finally {
				loading = false;
			}
		};

		loadData(); // Execute the load function.
	});

	function truncateHash(hash: string, start = 6, end = 4) {
		if (!hash) return '';
		return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
	}
</script>

<div>
	<h3 class="mb-6 text-center text-2xl font-semibold text-white">On-Chain Activity</h3>
	<div class="bg-background/20 rounded-xl border border-white/10 p-2 shadow-2xl backdrop-blur-md">
		{#if loading}
			<div class="flex h-56 items-center justify-center">
				<p class="text-center text-gray-400">Loading recent activity from the blockchain...</p>
			</div>
		{:else if error}
			<div class="flex h-56 items-center justify-center">
				<p class="text-center text-red-400">Error: {error}</p>
			</div>
		{:else if mintLogs.length === 0}
			<div class="flex h-56 items-center justify-center">
				<p class="text-center text-gray-400">No ideas have been timestamped yet.</p>
			</div>
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row class="border-white/20 hover:bg-white/5">
						<Table.Head class="text-white">Token ID</Table.Head>
						<Table.Head class="text-white">Block</Table.Head>
						<Table.Head class="text-white">Minter</Table.Head>
						<Table.Head class="text-right text-white">Transaction</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each mintLogs as log (log.transactionHash)}
						<Table.Row class="border-white/10 font-mono text-sm hover:bg-white/5">
							<Table.Cell>
								<Badge variant="secondary">#{log.tokenId}</Badge>
							</Table.Cell>
							<Table.Cell class="text-gray-400">{log.blockNumber}</Table.Cell>
							<Table.Cell class="text-gray-400">{truncateHash(log.minter)}</Table.Cell>
							<Table.Cell class="text-right">
								<a
									href={`https://sepolia.etherscan.io/tx/${log.transactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-400 hover:underline"
								>
									{truncateHash(log.transactionHash)}
								</a>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
