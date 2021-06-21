import React from "react";
import { io } from "socket.io-client";

const width = 50,
	height = 50,
	scale = 10;

function App() {
	const canvasRef = React.useRef(null);

	const [socket, setSocket] = React.useState(null);
	const [mouseActive, setMouseActive] = React.useState(false);
	const [mousePosition, setMousePosition] = React.useState([0, 0]);
	const [grid, setGrid] = React.useState(null);
	const [time, setTime] = React.useState(0);

	React.useEffect(() => {
		setTimeout(() => setTime((time) => time + 1), 100);

		if (grid && socket) {
			socket.emit("draw", grid);
		}
	}, [socket, time]);

	React.useEffect(() => {
		const socket = io("http://192.168.1.220:5000");

		socket.on("connect_error", console.error);

		socket.on("connect", () => {
			setSocket(socket);

			socket.on("draw", (grid) => {
				console.log("recieved");

				setGrid(grid);
			});
		});
	}, []);

	React.useEffect(() => {
		if (canvasRef.current) {
			const { current: canvas } = canvasRef;
			const context = canvas.getContext("2d");

			if (grid) {
				grid.forEach((value, index) => {
					let x = index % width,
						y = Math.floor(index / height);

					if (value === 1)
						context.fillRect(x * scale, y * scale, scale, scale);
				});
			}
		}
	}, [grid]);

	React.useEffect(() => {
		if (mouseActive && grid) {
			let tempGrid = [...grid];
			let [x, y] = mousePosition;

			const gridIndex = x + 50 * y;

			tempGrid[gridIndex] = 1;

			setGrid(tempGrid);
		}
	}, [mouseActive, mousePosition]);

	return (
		<main
			onMouseUp={setMouseActive.bind(null, false)}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<h1>multicanvas</h1>
			<canvas
				onMouseMove={({ nativeEvent: { offsetX: x, offsetY: y } }) => {
					setMousePosition([
						Math.floor(x / scale),
						Math.floor(y / scale),
					]);
				}}
				width={width * scale}
				height={height * scale}
				ref={canvasRef}
				onMouseDown={setMouseActive.bind(null, true)}
			/>
		</main>
	);
}

export default App;
