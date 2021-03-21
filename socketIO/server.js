/*
	chat
	socket.io : https://socket.io/docs/v3/index.html
	https://socket.io/docs/v3/emit-cheatsheet/
*/
const version = "version: 0.0.1";

const express = require("express");
const app = express();

app.use(express.static('www'));

const server = app.listen(8080,() =>
{
        console.log("server started");
});

const socket = require("socket.io");

const io = socket(server);

io.on("connection",(s) =>
{
	s.send({ raw: 'connect', msg: version });

	s.on("room",(data) =>
	{
		const trimRoom = data.room.trim();

		if(trimRoom.length > 0)
		{
			//s.leave(data.room);
			s.join(trimRoom);

			console.log(s.id + ' has joined room ' + trimRoom + ' (' + countUsers(trimRoom) + ')'); //log

			io.to(data.room).emit("message",{ raw: 'join', id: s.id, msg: ' has joined ' + trimRoom + ' \r\nUsers: (' + countUsers(trimRoom) + ')', room: trimRoom });
		}
	});

	s.on("message",(data) =>
	{
		const trimMsg = data.msg.trim();
		const trimRoom = data.room.trim();
		const trimId = data.id.trim();

		if((trimMsg.length > 0) && (trimRoom.length > 0) && (trimRoom.length <= 64))
		{
			io.to(trimRoom).emit("message",{ raw: 'msg', id: trimId, msg: trimMsg, room: trimRoom });
		}
	});
});

function countUsers(getRoom)
{
	let test = io.sockets.adapter.rooms.get(getRoom);
	let num = 0;

	test.forEach((e) =>
	{
		num++;
	});

        return num;
}
