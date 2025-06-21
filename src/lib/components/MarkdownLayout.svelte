<script>
	let { children } = $props();
</script>

<div class="prose prose-sm prose-neutral dark:prose-invert max-w-none">
	{@render children()}
</div>
