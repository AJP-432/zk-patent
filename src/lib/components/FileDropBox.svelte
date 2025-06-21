<!-- filepath: /home/aj/Documents/zk-patent/src/lib/components/FileDropBox.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils.js';

	// Define component props, including callbacks
	let {
		class: className,
		disabled = false,
		maxSize = 10, // in MB
		loading = false,
		onFileSelected,
		onSubmit,
		onError
	} = $props<{
		class?: string;
		disabled?: boolean;
		maxSize?: number;
		loading?: boolean;
		onFileSelected?: (file: File | null) => void;
		onSubmit?: (file: File) => void;
		onError?: (message: string) => void;
	}>();

	// Component state using runes
	let dragOver = $state(false);
	let selectedFile = $state<File | null>(null);
	let fileInput: HTMLInputElement;

	// Allowed file types and extensions
	const ALLOWED_TYPES = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/plain'
	];
	const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

	// --- Event Handlers ---

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		if (disabled || loading) return;

		const files = Array.from(event.dataTransfer?.files ?? []);
		processFiles(files);
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = Array.from(target.files ?? []);
		processFiles(files);
	}

	function removeFile() {
		selectedFile = null;
		if (fileInput) {
			fileInput.value = ''; // Reset the file input
		}
		onFileSelected?.(null);
	}

	function handleSubmit() {
		if (selectedFile) {
			console.log(`File submitted: ${selectedFile.name}`);
			onSubmit?.(selectedFile);
		}
	}

	// --- Helper Functions ---

	function processFiles(files: File[]) {
		if (files.length > 1) {
			onError?.('Please select only one file.');
			return;
		}

		const file = files[0];
		if (!file) {
			return; // User canceled the file dialog
		}

		const isTypeAllowed = ALLOWED_TYPES.includes(file.type);
		const isExtensionAllowed = ALLOWED_EXTENSIONS.some((ext) =>
			file.name.toLowerCase().endsWith(ext)
		);

		if (!isTypeAllowed && !isExtensionAllowed) {
			onError?.('Please select a PDF, DOCX, or TXT file.');
			return;
		}

		if (file.size > maxSize * 1024 * 1024) {
			onError?.(`File size must be less than ${maxSize}MB.`);
			return;
		}

		selectedFile = file;
		onFileSelected?.(selectedFile);
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function handleKeyDown(event: KeyboardEvent) {
		if ((event.key === 'Enter' || event.key === ' ') && !(disabled || loading)) {
			event.preventDefault();
			fileInput.click();
		}
	}
</script>

<div class={cn('w-full', className)}>
	<input
		bind:this={fileInput}
		type="file"
		class="sr-only"
		accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
		disabled={disabled || loading}
		onchange={handleFileSelect}
	/>

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
		onkeydown={handleKeyDown}
		role="button"
		tabindex={disabled || loading ? -1 : 0}
	>
		{#if !selectedFile}
			<div class="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
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
					{dragOver ? 'Drop your file here' : 'Upload a Document'}
				</h3>
				<p class="text-muted-foreground text-sm">
					Drag and drop your file here, or click to browse
				</p>
				<p class="text-muted-foreground mt-1 text-xs">
					(PDF, DOCX, or TXT up to {maxSize}MB)
				</p>
			</div>
		{:else}
			<div class="flex h-full flex-col p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold">Selected File</h3>
					<button
						class="text-primary text-sm hover:underline disabled:opacity-50"
						onclick={(e) => {
							e.stopPropagation();
							fileInput.click();
						}}
						disabled={loading}
						type="button"
					>
						Change File
					</button>
				</div>

				<div class="flex-1 space-y-3">
					<div
						class="border-border bg-background/50 flex items-center justify-between rounded-lg border p-3"
					>
						<div class="flex min-w-0 items-center space-x-3">
							<svg
								class="h-5 w-5 flex-shrink-0 text-red-500"
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
								<p class="truncate text-sm font-medium">{selectedFile.name}</p>
								<p class="text-muted-foreground text-xs">
									{formatFileSize(selectedFile.size)}
								</p>
							</div>
						</div>
						<button
							class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full p-1 disabled:opacity-50"
							onclick={(e) => {
								e.stopPropagation();
								removeFile();
							}}
							disabled={loading}
							type="button"
							aria-label="Remove file"
						>
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
				</div>

				<div class="border-border mt-4 border-t pt-4">
					<button
						class={cn(
							'w-full rounded-lg px-4 py-3 font-medium transition-all duration-200',
							'bg-primary text-primary-foreground hover:bg-primary/90',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'flex items-center justify-center space-x-2'
						)}
						onclick={(e) => {
							e.stopPropagation();
							handleSubmit();
						}}
						disabled={loading || !selectedFile}
						type="button"
					>
						{#if loading}
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
