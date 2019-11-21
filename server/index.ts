import http from 'http'
import Socket from 'socket.io'
import Sessions from './Sessions'

const PORT = 4000

const server = http.createServer()
const io = Socket(server)
const sessions = new Sessions()

io.on('connection', socket => {
	console.log('user connected')

	sessions.add(socket)
	socket.on('disconnect', reason => {
		console.log(`user disconnected ${reason}`)
	})
})

server.listen(PORT, () => console.log(`listening on *:${PORT}`))
