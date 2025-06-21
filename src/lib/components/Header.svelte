<script lang="ts">
	import ThemeButton from './ui/ThemeButton.svelte';
	import { onMount } from 'svelte';

	let text1 = 'zk-patent';
	let text2 = 'The Future of Idea Protection';
	let displayedText = '';
	let index = 0;
	let currentText = text1; // Start with the first phrase
	let isTyping = true;

	onMount(() => {
		const typeWriter = () => {
			if (isTyping) {
				if (index < currentText.length) {
					displayedText = currentText.substring(0, index + 1);
					index++;
					setTimeout(typeWriter, 50); // Typing speed
				} else {
					// Pause after typing
					setTimeout(() => {
						isTyping = false;
						setTimeout(deleteText, 3000); // Delay before deleting (3 seconds)
					}, 3000); // Delay after typing (3 seconds)
				}
			}
		};

		const deleteText = () => {
			if (index > 0) {
				displayedText = currentText.substring(0, index - 1);
				index--;
				setTimeout(deleteText, 30); // Deleting speed
			} else {
				// Switch to the other text
				currentText = currentText === text1 ? text2 : text1;
				isTyping = true;
				setTimeout(() => {
					typeWriter(); // Start typing the new text
				}, 500); // Small delay before typing the new text
			}
		};

		typeWriter(); // Start the initial typing
	});

	function scrollToTop() {
		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}, 200);
	}
</script>

<header class="bg-background/80 border-border top-0 z-50 border-b p-4 backdrop-blur-sm">
	<nav class="mx-auto flex max-w-4xl items-center justify-between px-4 py-2">
		<!-- Logo and Title -->
		<a
			href="/"
			onclick={(event) => {
				event.preventDefault();
				scrollToTop();
			}}
			class="text-2xl font-bold"
			aria-label="Scroll to top of page"
		>
			<h1
				class="h-[2.5rem] overflow-hidden text-4xl font-bold whitespace-nowrap"
				style="width: fit-content;"
			>
				{displayedText}
			</h1>
		</a>

		<!-- Theme Button -->
		<ThemeButton />
	</nav>
</header>

<style>
	h1 {
		border-right: 0.05em solid orange;
		animation: blink-caret 0.75s step-end infinite;
	}

	@keyframes blink-caret {
		from,
		to {
			border-color: transparent;
		}
		50% {
			border-color: orange;
		}
	}
</style>
