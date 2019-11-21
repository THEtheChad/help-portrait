import createSession from './createSession'

async function main() {
	await createSession({ user: { name: 'Chad Elliott' } })
	await createSession({ user: { name: 'Harry Potter' } })
	await createSession({ user: { name: 'John Legend' } })
}

main()
