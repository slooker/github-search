import * as functions from "firebase-functions"
import fetch from "node-fetch"
// I couldn't figure out how to write this Typescript style
const cors = require("cors")({origin: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true})
//   response.send("Hello from Firebase!")
// })

export const searchUser = functions.https.onRequest(
	async (request, response) => {
		cors(request, response, async () => {
		// Check for POST request
			const data = await _searchUser(request.body.search)
			// functions.logger.info(data)

			response.send(data)

		// https://api.github.com/search/users?q=Shawn%20Looker
		})
	},
)

const _searchUser = async (search: string) => {
	const searchUrl = "https://api.github.com/search/users?q=" + encodeURIComponent(search)
	const searchRes = await fetch(searchUrl);
	const searchData = await searchRes.json(); // assuming data is json

	console.log("Search data")
	console.log(searchData.items)
	console.log("Count of search items: " + searchData.items.length)

	const userList = []
	for (let i = 0; i < searchData.items.length; i++) {
		console.log("I: " + i)
		const searchEntry = searchData.items[i]
		const userUrl = "https://api.github.com/users/"+searchEntry["login"]
		console.log("User url: " + userUrl)
		const userRes = await fetch(userUrl)
		const userData = await userRes.json()

		userList.push({
			username: searchEntry.login,
			avatarUrl: searchEntry.avatar_url,
			location: userData.location,
			realName: userData.name,
			// This is often null, due to privacy reasons I assume?
			email: userData.email,
			publicRepos: userData.public_repos,
			accountCreationTimestamp: userData.created_at,
			lastUpdateTimestamp: userData.updated_at,
		})

		console.log("User data")
		console.log(userData)
	}
	return userList
	// return users
}
