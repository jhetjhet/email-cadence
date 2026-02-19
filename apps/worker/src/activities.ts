export async function sendEmailMock(input: {
	subject: string;
	body: string;
	to: string;
}) {
	return {
		success: true,
		messageId: crypto.randomUUID(),
		timestamp: Date.now()
	};
}
