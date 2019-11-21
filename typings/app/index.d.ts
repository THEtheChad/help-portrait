// foo.d.ts
declare module 'react-html5-camera-photo'
declare module 'rimraf'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface User {
	name: string
}

interface Session {
	id: string
	user: User
	isBeingEdited: boolean
}
