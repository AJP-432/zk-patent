<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string;
		disabled?: boolean;
		multiple?: boolean;
		maxSize?: number; // in MB
		loading?: boolean;
	}

	let {
		class: className,
		disabled = false,
		multiple = false,
		maxSize = 10,
		loading = false
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		filesSelected: File[];
		submit: File[];
		error: string;
	}>();

	let dragOver = $state(false);
	let fileInput: HTMLInputElement;
	let selectedFiles: File[] = $state([]);

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		if (disabled) return;

		const files = Array.from(event.dataTransfer?.files || []);
		processFiles(files);
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = Array.from(target.files || []);
		processFiles(files);
	}

	function processFiles(files: File[]) {
		const pdfFiles = files.filter((file) => file.type === 'application/pdf');

		if (pdfFiles.length === 0) {
			dispatch('error', 'Please select only PDF files.');
			return;
		}

		if (!multiple && pdfFiles.length > 1) {
			dispatch('error', 'Please select only one PDF file.');
			return;
		}

		const oversizedFiles = pdfFiles.filter((file) => file.size > maxSize * 1024 * 1024);
		if (oversizedFiles.length > 0) {
			dispatch('error', `File size must be less than ${maxSize}MB.`);
			return;
		}

		selectedFiles = pdfFiles;
		dispatch('filesSelected', pdfFiles);
	}

	function removeFile(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		if (selectedFiles.length === 0) {
			fileInput.value = '';
		}
		dispatch('filesSelected', selectedFiles);
	}

	function handleSubmit() {
		if (selectedFiles.length > 0) {
			console.log('🚀 Submit button clicked!');
			console.log('📄 Files submitted:', selectedFiles);
			console.log('📊 Number of files:', selectedFiles.length);

			// Log each file's details
			selectedFiles.forEach((file, index) => {
				console.log(`📋 File ${index + 1}:`, {
					name: file.name,
					size: `${formatFileSize(file.size)}`,
					type: file.type,
					lastModified: new Date(file.lastModified).toLocaleString()
				});
			});

			console.log('✅ Files are ready for backend processing!');
			dispatch('submit', selectedFiles);
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class={cn('w-full', className)}>
	<!-- File Input (Hidden) -->
	<input
		bind:this={fileInput}
		type="file"
		accept=".pdf,application/pdf"
		{multiple}
		disabled={disabled || loading}
		class="sr-only"
		onchange={handleFileSelect}
	/>

	<!-- Dropbox Area -->
	<div
		class={cn(
			'border-border bg-background/10 relative rounded-2xl border-2 border-dashed backdrop-blur-sm transition-all duration-200',
			'hover:border-primary/50 hover:bg-background/20',
			dragOver && 'border-primary bg-primary/5',
			(disabled || loading) && 'cursor-not-allowed opacity-50',
			!(disabled || loading) && 'cursor-pointer'
		)}
		ondrop={handleDrop}
		ondragover={(e) => {
			e.preventDefault();
			if (!(disabled || loading)) dragOver = true;
		}}
		ondragleave={(e) => {
			e.preventDefault();
			dragOver = false;
		}}
		onclick={() => !(disabled || loading) && fileInput.click()}
		role="button"
		tabindex={disabled || loading ? -1 : 0}
		onkeydown={(e) => {
			if ((e.key === 'Enter' || e.key === ' ') && !(disabled || loading)) {
				e.preventDefault();
				fileInput.click();
			}
		}}
	>
		{#if selectedFiles.length === 0}
			<!-- Empty State -->
			<div class="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
				<!-- Upload Icon using Heroicons -->
				<svg
					class={cn(
						'mb-4 h-12 w-12 transition-colors',
						dragOver ? 'text-primary' : 'text-muted-foreground'
					)}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-semibold">
					{dragOver ? 'Drop your PDF here' : 'Upload PDF Document'}
				</h3>
				<p class="text-muted-foreground text-sm">
					Drag and drop your PDF file here, or click to browse
				</p>
				<p class="text-muted-foreground mt-1 text-xs">
					Maximum file size: {maxSize}MB
				</p>
			</div>
		{:else}
			<!-- Selected Files -->
			<div class="flex h-full flex-col p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold">Selected Files</h3>
					<button
						class="text-primary text-sm hover:underline disabled:opacity-50"
						onclick={() => fileInput.click()}
						disabled={loading}
						type="button"
					>
						Change Files
					</button>
				</div>

				<!-- Files List -->
				<div class="flex-1 space-y-3 overflow-y-auto">
					{#each selectedFiles as file, index (file.name + file.size)}
						<div
							class="border-border bg-background/50 flex items-center justify-between rounded-lg border p-3"
						>
							<div class="flex items-center space-x-3">
								<!-- File Icon -->
								<svg
									class="h-5 w-5 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium">{file.name}</p>
									<p class="text-muted-foreground text-xs">
										{formatFileSize(file.size)}
									</p>
								</div>
							</div>
							<button
								class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full p-1 disabled:opacity-50"
								onclick={(e) => {
									e.stopPropagation();
									removeFile(index);
								}}
								disabled={loading}
								type="button"
								aria-label="Remove file"
							>
								<!-- Close Icon -->
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>

				<!-- Submit Button -->
				<div class="border-border mt-4 border-t pt-4">
					<button
						class={cn(
							'w-full rounded-lg px-4 py-3 font-medium transition-all duration-200',
							'bg-primary text-primary-foreground hover:bg-primary/90',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'flex items-center justify-center space-x-2'
						)}
						onclick={handleSubmit}
						disabled={loading || selectedFiles.length === 0}
						type="button"
					>
						{#if loading}
							<!-- Spinner using Tailwind -->
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"
							></div>
							<span>Processing...</span>
						{:else}
							<span>Submit for Analysis</span>
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
