import { Server, Socket } from 'socket.io';

type ClientToServerEvents = {
  // events que le client envoie, ex:
  // ping: () => void;
};

type ServerToClientEvents = {
  newAppointment: (appointment: any) => void; // ici tu mets ton type RDV réel
};

class SocketManager {
  private io: Server<ClientToServerEvents, ServerToClientEvents> | null = null;

  init(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*', // adapter selon besoin
      },
    });

    this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log('Socket connected', socket.id);

      socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
      });
    });

    console.log('Socket.IO initialized');
  }

  emitNewAppointment(appointment: any) {
    if (!this.io) {
      console.warn('Socket.IO not initialized yet');
      return;
    }
    this.io.emit('newAppointment', appointment);
  }
}

export const socketManager = new SocketManager();
