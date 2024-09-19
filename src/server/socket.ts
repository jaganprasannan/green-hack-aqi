// import { Server } from 'socket.io'

// let io: any

// export function initializeSocket(server: any) {
//   io = new Server(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST', 'PUT'],
//     },
//   })

//   io.on('connection', (socket: any) => {
//     console.log(`User connected with id ${socket.id}`)

//     socket.on('disconnect', () => {
//       console.log(`User disconnected with id ${socket.id}`)
//     })
//   })

//   return io
// }

// export function getIO() {
//   if (!io) {
//     throw new Error(
//       'Socket.IO has not been initialized. Please call initializeSocket first.',
//     )
//   }
//   return io
// }
