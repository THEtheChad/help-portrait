import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import EventEmitter from 'events'
import { Socket } from 'socket.io'

const { SESSION_DIR } = process.env

if (!SESSION_DIR) {
	throw new Error(`${__filename} requires the SESSION_DIR environment variable`)
}

// get absolute path
const session_dir = path.resolve(SESSION_DIR)

function getSession(filepath: string) {
	const base = filepath.replace(session_dir, '')
	const parts = base.split(path.sep)
	return parts[1]
}

export default class Sessions extends EventEmitter {
	sessions: Array<Session>

	constructor() {
		super()

		this.sessions = []

		const watcher = chokidar.watch(session_dir)

		watcher
			.on('add', filepath => {
				fs.readFile(filepath, (_err, contents) => {
					const session = JSON.parse(contents.toString())
					this.sessions.push(session)
					this.emit('session:add', session)
				})
			})
			.on('change', filepath => {
				console.log('CHANGE', getSession(filepath))
				const session = this.sessions[0]
				this.emit('session:update', session)
			})
			.on('unlink', filepath => {
				const target = getSession(filepath)
				const idx = this.sessions.findIndex(session => session.id === target)
				const session = this.sessions.find(session => session.id === target)
				this.sessions.splice(idx, 1)
				this.emit('session:remove', session)
			})
	}

	add(socket: Socket) {
		this.sessions.forEach(session => socket.emit('session:add', session))

		this.on('session:add', (session: Session) => socket.emit('session:add', session))
		this.on('session:update', (session: Session) => socket.emit('session:update', session))
		this.on('session:remove', (session: Session) => socket.emit('session:remove', session))
	}
}
