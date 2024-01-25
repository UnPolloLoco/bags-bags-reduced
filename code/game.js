// -------------------- SCENE -------------------- //

scene('game', () => {

	// init stuff

	setGravity(SCALE * GRAVITY);
	
	let startTime = time();

	var money = 0;
	var totalGameTime = 15;
	var gameEnded = false;

	// functions

	function getStoneColorVariation() {
		return randi(140,200);
	}

	
	function getBlockFrame(b) {
		let bim = BLOCK_INFO[b.material];
		
		return 2 + b.appearanceNumber - Math.floor(
			b.strength / bim.max * 3
		);
	}
	
	
	function damageBlock(block, x) {
		
		thePickaxe.pos = block.pos.sub(player.pos).unit().scale(SCALE);
		thePickaxe.angle = thePickaxe.pos.angle(vec2(0,0)) - 90 + randi(-10, 10);

		
		block.strength -= x;
		if (block.strength < 0) {

			// explode on break
			add([
				sprite('explosion', { anim: 'boom' }),
				pos(block.pos),
				scale(SCALE/213 * 2.4),
				anchor('center'),
				lifespan(0.22),
				rotate(randi(0, 360)),
			])

			shake(SCALE/25)
			
			changeMoney(block.worth);
			destroy(block);
			
		} else {
			block.frame = getBlockFrame(block);

			// damage effect
			add([
				sprite('effects', { anim: 'boom' }),
				pos(block.pos),
				scale(SCALE/100 * 1.6),
				anchor('center'),
				lifespan(0.22),
				rotate(randi(0, 360)),
				opacity(rand(0.4, 0.8))
			])
		}
	}


	function changeMoney(x) {
		money += x;
		moneyText.text = '$' + money;
	}

	
	function weightedChoose(data) {
		let temp = [];
		let dataKeys = Object.keys(data);
		
		for (let k = 0; k < dataKeys.length; k++) {
			let dataKey = dataKeys[k];
			for (let n = 0; n < data[dataKey]; n++) {
				temp.push(dataKey);
			}
		}
	
		return choose(temp);
	}

	
	function blockCollide(b) {
		damageBlock(b, pickStrengthFactor());
	}
	

	function pickStrengthFactor() {
		return 2 ** (stats.pickStrength - 1);
	}

	
	function autoMineLoopTime() {
		return 1 / stats.autoMineLoop;
	}

	// -------------------- END EVENT -------------------- //

	function endGame() {
		if (!gameEnded) {
			gameEnded = true;
			stats.totalMoney += money;
			saveGame();

			menu.children.forEach((c) => {
				tween(
					0, c.opacityGoal,
					0.5,
					(val) => c.opacity = val,
					easings.easeInOutQuad
				)	
			})

			if (stats.totalMoney != money) {
				wait(0.5, () => {
					// change money text display
					tween(
						money, stats.totalMoney,
						0.5,
						(val) => moneyText.text = `$${Math.floor(val)}`,
						easings.easeInOutCubic
					)
	
					// text size up
					tween(
						1, 1.1,
						0.5,
						(val) => moneyText.scale = vec2(val),
						easings.easeInOutCubic
					)
					
					// text color green
					let greenTween = tween(
						255, 0,
						0.25,
						(val) => moneyText.color = rgb(val, 255, val),
						easings.easeInOutCubic
					)
	
					// text color white
					wait(0.25, () => {
						greenTween.cancel();
						
						tween(
							0, 255,
							0.25,
							(val) => moneyText.color = rgb(val, 255, val),
							easings.easeInOutCubic
						)
					})
				})
			}

			homeButton.onClick(() => { go('home') });
			retryButton.onClick(() => { go('game') });
			shopButton.onClick(() => { go('shop') });
		}
	}
	
	// -------------------- END SCREEN -------------------- //

	const menu = add([
		pos(0,0),
		fixed(),
		z(100),
	])

	// black shading

	menu.add([
		rect(width(), height()),
		pos(0,0),
		color(BLACK),
		opacity(0),
		{ opacityGoal: 0.7 }
	])

	// home

	const homeButton = menu.add([
		sprite('buttons', { frame: 2 }),
		scale(SCALE/213),
		pos(SCALE*4, SCALE*9),
		color(WHITE),
		opacity(0),
		anchor('center'),
		area(),
		"button",
		{ opacityGoal: 0.5 }
	])

	// retry

	const retryButton = menu.add([
		sprite('buttons', { frame: 0 }),
		scale(SCALE/213 * 1.7),
		pos(width()/2, SCALE*9),
		color(WHITE),
		opacity(0),
		anchor('center'),
		area(),
		"button",
		{ opacityGoal: 0.5 }
	])
	
	// shop

	const shopButton = menu.add([
		sprite('buttons', { frame: 4 }),
		scale(SCALE/213),
		pos(SCALE*12, SCALE*9),
		color(WHITE),
		opacity(0),
		anchor('center'),
		area(),
		"button",
		{ opacityGoal: 0.5 }
	])

	
	
	
	// -------------------- GAME -------------------- //

	// background

	add([
		sprite('caveBackground'),
		pos(center()),
		scale(SCALE/500 * 11.2),
		anchor('center'),
		fixed(),
		color(rgb(BACKGROUND_BRIGHTNESS, BACKGROUND_BRIGHTNESS, BACKGROUND_BRIGHTNESS)),
	])
	
	// create block grid
	
	for (let section = 0; section < LAYER_INFO.length; section++) {
		let sectionInfo = LAYER_INFO[section];
		let columns = ROCKS_PER_ROW;
		
		for (let y = sectionInfo.from; y < sectionInfo.to; y++) {
			for (let x = 0; x < columns; x++) {
				let material = weightedChoose(sectionInfo.contents);
				let materialInfo = BLOCK_INFO[material];
				let strength = randi(
					materialInfo.min, materialInfo.max
				);
				let oreColor = materialInfo.oreColor;
				let colorVariation = getStoneColorVariation();
				
				let block = add([
					sprite('blocks'),
					scale(SCALE/200 * 8/columns),
					pos(center().add(
						SCALE * (x - columns / 2 + 0.5) * 8/columns,
						SCALE * y * 8/columns
					)),
					anchor('center'),
					area(),
					body({ isStatic: true }),
					offscreen({ 
						hide: true,
						distance: SCALE,
					}),
					color(rgb(colorVariation, colorVariation, colorVariation)),
					'block',
					`shiny?${materialInfo.shiny}`,
					{
						'strength': strength,
						'worth': materialInfo.reward,
						'material': material,
						'appearanceNumber': randi(0,2)*3
					}
				]);

				block.frame = getBlockFrame(block);

				// ore

				if (oreColor != 'no ore') {
					block.add([
						sprite('blocks', { 
							frame: randi(6,9)
						}),
						anchor('center'),
						color(oreColor),
						scale(rand(0.8, 1))
					])
				}
			}
		}
	}

	// spawn player

	const player = add([
		sprite('miner'),
		scale(SCALE/320 * 1),
		pos(width()/2, 0),
		anchor('center'),
		area(),
		body(),
	]);

	const thePickaxe = player.add([
		sprite('miner', { frame: 1 }),
		pos(0, 0),
		anchor('top'),
		rotate(0)
	])

	// -------------------- UI -------------------- //
	
	// side walls

	for (let i = 0; i < 2; i++) {
		add([
			rect(SCALE*4, SCALE*120),
			pos(i * SCALE*12, 0),
			color(DARK_COLOR_2),
			fixed(),
			area(),
			body({ isStatic: true }),
			opacity(0)
		])
	}


	add([
		sprite('caveForeground', { flipX: true, height: 650, width: 250 }),
		pos(0,0),
		scale(SCALE/250 * 4.8),
		fixed(),
		color(rgb(FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS)),
	])

	add([
		sprite('caveForeground', { height: 650, width: 250 }),
		pos(width(), 0),
		scale(SCALE/250 * 4.8),
		fixed(),
		anchor('topright'),
		color(rgb(FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS, FOREGROUND_BRIGHTNESS)),
	])

	// money counter

	const moneyText = add([
		text('$0', {
			size: SCALE,
			align: 'center',
			font: 'poppins',
		}),
		pos(width()/2, SCALE*2),
		anchor('center'),
		color(WHITE),
		fixed(),
		z(101),
	])

	// timer bar bg

	add([
		rect(SCALE, SCALE*8, { radius: SCALE/2 }),
		pos(SCALE*2.5, SCALE*1.5), 
		anchor('top'),
		color(DARK_COLOR),
		fixed()
	])

	// timer progress bar

	const timerProgressBar = add([
		rect(SCALE*0.6, SCALE*7.6, { radius: SCALE*0.3 }),
		pos(SCALE*2.5, SCALE*9.3), 
		anchor('bot'),
		color(PROG_BAR_BLUE),
		fixed()
	])

	// timer counter bg

	for (let i = 0; i < 2; i++) {
		add([
			circle(SCALE*0.9 - i*SCALE*0.2),
			pos(SCALE*2.5, height()/2),
			anchor('center'),
			color(i == 0 ? DARK_COLOR : DARK_COLOR_2),
			fixed()
		])
	}

	// timer counter

	const timeCounter = add([
		text('', { 
			size: SCALE*0.7,
			font: 'poppins',
		}),
		pos(SCALE*2.5, height()/2 + SCALE/7),
		anchor('center'),
		color(WHITE),
		fixed(),
	])

	// controls

	add([
		sprite('controls'),
		pos(width() - SCALE*0.75, height() - SCALE),
		scale(SCALE/250 * 2),
		anchor('botright'),
		fixed(),
		lifespan(1, { fade: 1 }),
		opacity(1)
	])

	

	// -------------------- EVENTS -------------------- //


	// controls
	
	onKeyDown((key) => {

		if (!gameEnded) {
	
			// walk
			
			if (key == 'a' || key == 'd') {
				let mult = (key == 'a') ? -1 : 1;
				
				player.move(
					mult * SCALE * WALK_SPEED, 0
				);
			}
	
			// small jump
	
			if (key == 's' || key == 'm') {
				if (player.isGrounded()) { 
					player.jump(JUMP_FORCE * SCALE); 
				}
			}
	
			// big jump
	
			if (key == 'w' || key == 'n') {
				if (player.isGrounded()) { 
					player.jump(LARGE_JUMP_FORCE * SCALE); 
				}
			}



			// end

			if (key == 'p') {
				endGame();
			}

		}
	})
	

	// collision check

	player.onCollide('block', (b, col) => {
		if (!gameEnded) {
			
			damageBlock(b, pickStrengthFactor());
			
		}
	})
	
	// auto miner collider

	if (!false) {
		loop(autoMineLoopTime(), () => {
			if (!gameEnded) {
				
				get('block').forEach((b) => {
					if (player.isColliding(b)) {
						blockCollide(b)
					}
				})
				
			}
		})
	}

	// button hover effect

	onHover('button', (b) => {
		if (gameEnded)
			b.opacity = 1;
	})

	onHoverEnd('button', (b) => {
		if (gameEnded)
			b.opacity = 0.5;
	})
	

	// -------------------- UPDATE LOOP -------------------- //

	onDraw(() => {
		get('block').forEach((b) => {
			if (!b.hidden) {
				let trueStr = b.strength + 1
				let sizeAdd = SCALE* Math.min(
					1/6 * trueStr/100,
					1/7
				);
				drawText({
						text: `${trueStr}`,
						anchor: 'center',
						pos: b.pos,
						size: SCALE/3 + sizeAdd,
						z: 100,
						font: 'poppinsOutline',
				});
			}
		})
	})

	// onUpdate prep
	
	let camTween;
	
	// main loop
	
	onUpdate(() => {

		// y val game ender

		if (player.pos.y > center().y + (SCALE * 110 * 8/ROCKS_PER_ROW)) {
			endGame();
		}
		
		// shiny ore

		get('shiny?true').forEach((s) => {
			if (!s.hidden && randi(0,100) < 10) {
				add([
					sprite('effects'),
					pos(s.pos.add(
						vec2(rand(-0.7, 0.7), rand(-0.7, 0.7)).scale(SCALE)
					)),
					lifespan(rand(0.2, 0.4), { fade: 0.2 }),
					scale(SCALE/100 * rand(0.1, 0.5)),
					opacity(1),
					anchor('center')
				])
			}
		})
		
		// tween camera
		
		if (camTween) camTween.cancel();
		
		camTween = tween(
			camPos().y, 
			Math.max(
				player.pos.y + SCALE,
				height()/2
			),
			1,
			(val) => camPos(width()/2, val),
			easings.easeOutQuad
		);

		// update timer

		if (!gameEnded) {

			let elapsedTime = time() - startTime;
			let timeRemaining = totalGameTime - elapsedTime
	
			timeCounter.text = Math.max(0, Math.ceil(timeRemaining));
	
			// time progress bar appearance
			
			timerProgressBar.height = SCALE*7.6 * timeRemaining / totalGameTime;
			
			if (timeRemaining <= 3) {
				timerProgressBar.color = PROG_BAR_RED;
	
					if (timeRemaining <= 0) {
						endGame();
					}
			}
	
			timerProgressBar.width = Math.min(timerProgressBar.height, SCALE*0.6);

		}
		
	})


});
