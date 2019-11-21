import createUser from './createUser'

async function main() {
	await createUser({ name: 'Chad Elliott' })
	await createUser({ name: 'Harry Potter' })
	await createUser({ name: 'John Legend' })
}

main()
