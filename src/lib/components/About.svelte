<script lang="ts">
	// @ts-expect-error import about.svx not found, despite being in the project
	import AboutContent from '$lib/content/about.svx';
	import FileDropBox from './FileDropBox.svelte';
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
					class="bg-background/10 flex h-80 w-full items-center justify-center rounded-2xl backdrop-blur-sm"
				>
					<FileDropBox />
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
				</div>
			</div>
		</div>
	</div>
</section>
