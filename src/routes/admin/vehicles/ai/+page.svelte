<script lang="ts">
	import OpenAI from 'openai';

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY
	});

	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: "Write a 1 paragraph SEO friendly and exciting description for 2023 Scarab Jet Boat 215 ID 460HP WAKE EDITION model code SBI215-A23, trim color charcoal.  Don't use the model code in the description, only use it to get the most accurate boat, engine or feature specs.  Use the trim color briefly when describing this boat."
					}
				]
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: 'Rev up the excitement on the water with the 2023 Scarab Jet Boat 215 ID 460HP Wake Edition, a sleek marvel clad in an eye-catching charcoal trim. This powerhouse redefines adventure with its robust 460 horsepower engine, ensuring thrilling rides and the ultimate wake experience. Crafted for speed enthusiasts and watersport aficionados, the Scarab 215 ID embraces cutting-edge technology and superior design, providing unparalleled control and heart-pounding performance. Perfectly marrying style and functionality, this boat boasts luxurious amenities and intuitive features, making it the quintessential choice for those looking to carve massive wakes with flair. Discover the exhilarating blend of power, precision, and sophistication that sets the Scarab 215 ID apart, and transform every outing into an unforgettable voyage.'
					}
				]
			}
		],
		response_format: {
			type: 'text'
		},
		temperature: 1,
		max_completion_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});
</script>

<div>
	{#each response.choices as choice}
		{choice.message.content}
	{/each}
</div>
