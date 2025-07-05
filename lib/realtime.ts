import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join a room based on location
      socket.on('join-location', (data: { lat: number; lng: number; radius: number }) => {
        const room = `location-${Math.round(data.lat * 100)}-${Math.round(data.lng * 100)}`;
        socket.join(room);
        socket.data.room = room;
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      // Update user location
      socket.on('update-location', (data: {
        userId: string;
        username: string;
        game: string;
        location: { lat: number; lng: number };
        isOnline: boolean;
      }) => {
        // Broadcast to all clients in the same location room
        if (socket.data.room) {
          socket.to(socket.data.room).emit('player-updated', data);
        }
      });

      // User goes offline
      socket.on('user-offline', (data: { userId: string }) => {
        if (socket.data.room) {
          socket.to(socket.data.room).emit('player-offline', data);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return res.socket.server.io;
}; 