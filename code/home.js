scene('home', () => {

	// background

	for (let i = 0; i < 2; i++) {
		add([
			sprite('caveBackground'),
			pos(width()/2, 0),
			anchor(['topright', 'topleft'][i]),
			scale(SCALE/500 * 11.2),
			color(rgb(FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS)),
		])
	}

	// logo

	const logo = add([
		sprite('logo'),
		scale(SCALE/500 * 8),
		pos(center().sub(0, SCALE*1.5)),
		anchor('center'),
	])

	// play button

	const playButton = add([
		sprite('buttons', { frame: 5, }),
		pos(center().add(0, SCALE*2.5)),
		scale(SCALE/213 * 1.5),
		anchor('center'),
		area(),
	])

	// reset progress button

	const resetButton = add([
		sprite('buttons'),
		pos(SCALE, height() - SCALE),
		anchor('center'),
		area(),
		opacity(0.2),
		scale(SCALE/213 * 0.6)
	])

	// play button click

	playButton.onClick(() => {
		go('game');
	})

	// reset button click

	resetButton.onClick(() => {
		if (prompt('Type in "bleeeaarrghhh" to reset your progress...') == 'bleeeaarrghhh') {
			stats = {
				'totalMoney': 0,
				'pickStrength': 1,
				'autoMineLoop': 1,
			};
			saveGame();
			alert('Progress erased :(')
		} else {
			alert("That's what I thought.")
		}
	})
	
	// play hover checker

	playButton.onHover(() => {
		playButton.scale = vec2(SCALE/213 * 1.6);
	})

	playButton.onHoverEnd(() => {
		playButton.scale = vec2(SCALE/213 * 1.4);
	})

	// reset hover checker

	resetButton.onHover(() => {
		resetButton.opacity = 1;
		resetButton.color = RED;
	})

	resetButton.onHoverEnd(() => {
		resetButton.opacity = 0.2;
		resetButton.color = WHITE;
	})


	// update loop
	
	onUpdate(() => {
		logo.pos.y = height()/2 - SCALE * (
			1.5 + 0.07*Math.sin(time() * 3)
		)
	})
	
	
})

go('home');
