<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-background/80 border-border border-t p-4 backdrop-blur-sm">
	<!-- Desktop layout -->
	<div class=" mx-auto hidden max-w-4xl items-center justify-between px-4 py-2 md:flex">
		<div class="text-muted-foreground text-sm">
			<span>© {currentYear}</span>
			<span>Ajlal Paracha and Ehteshaam Paracha</span>
			<span>•</span>
			<span>Made with ❤️</span>
		</div>
	</div>

	<!-- Mobile layout - stacked -->
	<div class="mx-auto flex max-w-4xl flex-col items-center space-y-3 px-4 py-2 md:hidden">
		<div class="text-muted-foreground flex items-center space-x-4 text-sm">
			<span>© {currentYear}</span>
			<span>Ajlal Paracha and Ehteshaam Paracha</span>
			<span>•</span>
			<span>Made with ❤️</span>
		</div>
	</div>
</footer>
