import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });
  // CORS config allows frontend (different origin) to connect to this socket server
  // without this, browser would block the connection

  io.on("connection", (socket) => {
    // Whenever any frontend connects using io.connect(), run this function.
    //"connection" is a built-in Socket.IO event triggered when a client connects, and "socket" is the unique connection object representing that specific client.
    console.log("SOMETHING CONNECTED");
    socket.on("join-call", (path) => {
      // 'path' comes from frontend via socket.emit("join-call", path), it represents the room/meeting ID that user wants to join
      if (connections[path] === undefined) {
        connections[path] = []; // if room does not exist, create an empty array for that room
      }
      connections[path].push(socket.id); // add current user's socket.id to the room
      timeOnline[socket.id] = new Date(); // store the time when user joined the call

      for (let a = 0; a < connections[path].length; a++) {
        // loop through all users in the room and notify them that a new user joined
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
        );
      }

      if (messages[path] !== undefined) {
        // if there are any previous messages in the room, send them to the newly joined user
        for (let a = 0; a < messages[path].length; a++) {
          io.to(socket.id).emit(
            //send ONLY to the newly joined user
            "chat-message",
            messages[path][a]["data"], // message content
            messages[path][a]["sender"], // sender name (frontend)
            messages[path][a]["socket-id-sender"], // actual sender socket id
          );
        }
      }
    });
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false],
      );
      // reduce loops through all rooms to find where current socket.id exists
      // once found, isFound becomes true → !isFound becomes false → stops further checking
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = []; // if no previous messages in the room, create an empty array for that room
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        // add the new message to the room's message array

        console.log("message", matchingRoom, ":", sender, data);
        connections[matchingRoom].forEach((socketId) => {
          io.to(socketId).emit("chat-message", data, sender, socket.id); // send the new message to all users in the room
        });
      }
    }); // listens when a user sends a chat message (data = message, sender = frontend name)

    socket.on("disconnect", () => {
      // triggers when user disconnects (tab close, internet loss, or leaves app)
      var diffTime = Math.abs(timeOnline[socket.id] - new Date()); // calculate how long the user was online in seconds
      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections)),
      )) {
        for (let a = 0; a < v.length; a++) {
          if (v[a] === socket.id) {
            key = k; // find the room that the user was in
            for (let a = 0; a < connections[key].length; a++) {
              io.to(connections[key][a]).emit("user-left", socket.id); // notify all users in the room that this user has disconnected and how long they were online
            }
            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1); // remove the user from the room's connection list

            if (connections[key].length === 0) {
              delete connections[key]; // if no users left in the room, delete the room
            }
          }
        }
      }
    });
  });
  return io;
};
