import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const searchUser = functions.https.onRequest(async (request, response) => {
	functions.logger.info("User searched for ",request.body)
	const url = 'https://api.github.com/search/users?q=' + encodeURIComponent(request.body)
	functions.logger.info('Url: ', url)
	const resp = await fetch(url)

	functions.logger.info('Response body: ', resp.body)

	response.send(resp.body)

	// https://api.github.com/search/users?q=Shawn%20Looker
})