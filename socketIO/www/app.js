//app.js
let connect = io.connect();

function start(socket)
{
	const btnID = document.getElementById("btn");
	const roomID = document.getElementById("room");
	const windowID = document.getElementById("window");
	const textID = document.getElementById("text");

	socket.on("disconnect",(e) =>
	{
		windowID.innerText = 'Disconnected.\r\nReconnecting..\r\n';

		roomID.value = '';
	});

	socket.on("message",(data) =>
	{
		if(data.raw === 'msg')
		{
			windowID.innerText += data.id + ': ' + data.msg + '\r\n';
		}
		else if(data.raw === 'connect')
		{
			windowID.innerText += data.msg + '\r\n';
		}
		else if(data.raw === 'join')
		{
			windowID.innerText += data.id + data.msg + '\r\n';
		}
		else if(data.raw === 'error')
		{
			windowID.innerText += data.msg + '\r\n';
		}
		else
		{
			return false;
		}

		windowID.scrollTop = windowID.scrollHeight - windowID.clientHeight;
	});

	btnID.addEventListener("click",(e) =>
	{
		socket.emit("room",
		{
			room: roomID.value
		});
	});

	textID.addEventListener("keypress",(e) =>
	{
		if(e.key === "Enter")
		{
			socket.send({ id: socket.id, msg: textID.value, room: roomID.value });

			textID.value = '';
		}
	});
}

start(connect);
