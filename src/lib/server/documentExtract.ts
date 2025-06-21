import mammoth from 'mammoth';
import { createRequire } from 'module';

// Create a require function that we can use to load CJS modules
const require = createRequire(import.meta.url);

export async function extractText(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());

	if (file.type === 'application/pdf') {
		// Use our new require function to load pdf-parse, as it is a CommonJS module
		const pdf = require('pdf-parse');
		const data = await pdf(buffer);
		return data.text;
	} else if (
		file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	) {
		const { value } = await mammoth.extractRawText({ buffer });
		return value;
	} else {
		return file.text();
	}
}
