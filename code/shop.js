scene('shop', () => {

	// -------------------- MENU BACKGROUND -------------------- //

	// cave bg
	
	for (let i = 0; i < 2; i++) {
		add([
			sprite('caveBackground'),
			pos(SCALE*8*i, SCALE*3),
			scale(SCALE/500 * 8),
			color(rgb(BACKGROUND_BRIGHTNESS, BACKGROUND_BRIGHTNESS, BACKGROUND_BRIGHTNESS)),
		])
	}
	
	// top section

	add([
		pos(0,0),
		rect(width(), SCALE*3),
		color(DARK_COLOR_2),
	])

	// top section highlight

	add([
		pos(SCALE*3, 0),
		rect(width() - SCALE*6, SCALE*3),
		color(DARK_COLOR_2.lighten(10)),
	])

	// top shadow

	add([
		pos(0, SCALE*3),
		rect(width(), SCALE*0.2),
		color(BLACK),
		opacity(0.3)
	])


	// -------------------- MENU FEATURES -------------------- //

	// retry

	const retryButton = add([
		sprite('buttons', { frame: 1 }),
		pos(SCALE*1.5, SCALE*1.5),
		scale(SCALE/213),
		anchor('center'),
		opacity(0.5),
		area(),
		"shopMenuButton",
	])

	// home

	const homeButton = add([
		sprite('buttons', { frame: 2 }),
		pos(width() - SCALE*1.5, SCALE*1.5),
		scale(SCALE/213),
		anchor('center'),
		opacity(0.5),
		area(),
		"shopMenuButton",
	])

	// shop text

	add([
		text('SHOP', {
			size: SCALE*1.2,
			align: 'center',
			font: 'poppinsBold',
		}),
		pos(width()/2, SCALE*1.5),
		anchor('center'),
	])

	// money count

	const shopMoneyCounter = add([
		text(`$${stats.totalMoney}`, {
			size: SCALE/3,
			align: 'center',
			font: 'poppins',
		}),
		pos(width()/2, SCALE*2.3),
		anchor('center')
	])

	// -------------------- SHOP ITEMS -------------------- //
	
	// functions

	function getItemPrice(item) {
		let basePrice = {
			'pickStrength': PICK_STRENGTH_BASE_COST,
			'autoMineLoop': AUTO_MINE_BASE_COST,
		}[item];

		return basePrice * (PRICE_INCREASE_RATE[item] ** (stats[item]-1));
	}
	

	function updateShopVisuals() {
		get('upgradeProgressBit').forEach((b) => {
			b.color = b.index + 1 <= stats[b.currentItem] ? GREEN : DARK_COLOR_2
		})

		get('shopUpgradeButton').forEach((b) => {
			let itemPrice = getItemPrice(b.currentItem);
			let atPurchaseLimit = stats[b.currentItem] >= AVAILABLE_UPGRADE_SLOTS[b.currentItem];

			if (itemPrice <= stats.totalMoney && !atPurchaseLimit) {
				b.frame = 3;
			} else {
				b.frame = 2;
			}

			b.label.text = atPurchaseLimit ? 'MAX' : `$${itemPrice}`;

			shopMoneyCounter.text = `$${stats.totalMoney}`;
		})

		saveGame();
	}

	// info dim

	const infoMessageDimmer = add([
		pos(0,0),
		rect(width(), height()),
		color(BLACK),
		opacity(0),
		z(90),
	])
	
	// loop

	for (let item = 0; item < 2; item++) {

		let extraY = item*SCALE*3;

		let currentItem = ['pickStrength', 'autoMineLoop'][item];

		// icon bg

		add([
			rect(SCALE*2.7, SCALE*2.7),
			pos(SCALE*4, SCALE*5.5 + extraY),
			anchor('center'),
			color(DARK_COLOR_2),
			opacity(0.6),
		])

		// icon
		
		add([
			sprite('shopStuff', { frame: item }),
			pos(SCALE*4, SCALE*5.5 + extraY),
			scale(SCALE/320 * 2.5),
			anchor('center'),
		])
	
		// buy button
		
		let btn = add([
			sprite('shopStuff', { frame: 2 }),
			scale(SCALE/320 * 2.25),
			pos(SCALE*6.25, SCALE*4.8 + extraY),
			anchor('left'),
			area({ scale: vec2(1, 0.3) }),
			"shopUpgradeButton",
			{
				'currentItem': currentItem,
				'label': 0,
			}
		])
	
		// buy btn price

		let basePrice = [PICK_STRENGTH_BASE_COST, AUTO_MINE_BASE_COST][item];
		
		btn.label = add([
			text(`$${basePrice}`, {
				size: SCALE*0.4,
				align: 'center',
				font: 'poppinsOutline',
			}),
			pos(SCALE*7.35, SCALE*4.84 + extraY),
			anchor('center'),
			color(WHITE),
		])

		// info button

		let currentInfoBtn = add([
			sprite('buttons', { frame: 3 }),
			scale(SCALE/213 * 0.5),
			pos(SCALE*9, SCALE*4.8 + extraY),
			anchor('left'),
			area(),
			opacity(0.75),
			z(100),
			`${item}Info`,
			'infoButton'
		])

		currentInfoBtn.msg = add([
			text([
				'When you smash into a rock, double your damage per upgrade',
				'Damage a block by resting on it twice as often per upgrade'
			][item], {
				size: SCALE/3,
				width: SCALE*7,
				align: 'left',
				font: 'poppins',
			}),
			pos(0,0),
			anchor('botright'),
			opacity(0),
			z(105),
			'infoMessage'
		])

	
		// progress bar of upgrade level

		let currentMaxUp = AVAILABLE_UPGRADE_SLOTS[currentItem];
	
		for (let i = 0; i < currentMaxUp; i++) {
	
			let progressBlockWidth = 7
				- (SHOP_BAR_PADDING * currentMaxUp) 
				+ SHOP_BAR_PADDING;
			
			progressBlockWidth /= currentMaxUp;
	
			let progressBlockOffset = i * (progressBlockWidth + SHOP_BAR_PADDING);
	
			// visual
			
			add([
				rect(
					progressBlockWidth*SCALE, 
					SCALE - SHOP_BAR_PADDING*2
				),
				pos(
					SCALE*6.25 + progressBlockOffset*SCALE, 
					SCALE*5.5 + SHOP_BAR_PADDING + extraY
				),
				color(DARK_COLOR_2),
				'upgradeProgressBit',
				{
					'currentItem': currentItem,
					'index': i,
				}
			])

			// shading

			add([
				rect(
					progressBlockWidth*SCALE, 
					(SCALE - SHOP_BAR_PADDING*2) * 0.5
				),
				pos(
					SCALE*6.25 + progressBlockOffset*SCALE, 
					SCALE*6.0 + SHOP_BAR_PADDING + extraY
				),
				color(DARK_COLOR_2),
				opacity(0.3)
			])
		}

	}

	// modify

	updateShopVisuals();

	// -------------------- EVENTS -------------------- //

	// BUY BUY BUY

	onClick('shopUpgradeButton', (b) => {
		if (b.frame == 3) {
			stats.totalMoney -= getItemPrice(b.currentItem);
			stats[b.currentItem]++;

			updateShopVisuals();
		}
	})

	// button hover effect

	onHover('shopMenuButton', (b) => {
		b.opacity = 1;
	})

	onHoverEnd('shopMenuButton', (b) => {
		b.opacity = 0.5;
	})

	// pickaxe up info

	onHover('infoButton', (b) => {
		infoMessageDimmer.opacity = 0.6;
		b.msg.opacity = 1; 
		b.opacity = 1;
	});
	onHoverEnd('infoButton', (b) => { 
		infoMessageDimmer.opacity = 0;
		b.msg.opacity = 0; 
		b.opacity = 0.75;
	});

	// button action

	homeButton.onClick(() => { go('home') })
	retryButton.onClick(() => { go('game') })

	// update

	onUpdate(() => {
		get('infoButton').forEach((ib) => {
			ib.msg.pos = mousePos().sub(vec2(SCALE/3));
		})
	})
	
})
