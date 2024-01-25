const SCREEN_RATIO = 0.7;

let ww = window.innerWidth;let wh = window.innerHeight;let kaboomDimensions = {};if (ww * SCREEN_RATIO > wh) {kaboomDimensions = { w: wh / SCREEN_RATIO,h: wh};} else {kaboomDimensions = {w: ww,h: ww * SCREEN_RATIO};};

kaboom({
	background: [20,20,20],
	width: kaboomDimensions.w,
	height: kaboomDimensions.h,
	inspectColor: [255,255,255],
	pixelDensity: 1.5,
});

loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

loadSprite("blocks", "https://i.ibb.co/GWrxb2f/IMG-0813.png", {
	sliceX: 3, sliceY: 3
})
loadSprite("buttons", "https://i.ibb.co/FxgtQQ4/IMG-0871.png", {
	sliceX: 3, sliceY: 2
})
loadSprite("shopStuff", "https://i.ibb.co/CzFxYvn/IMG-0861.png", {
	sliceX: 2, sliceY: 2
})
loadSprite("miner", "https://i.ibb.co/jL3v4y5/IMG-0862.png", {
	sliceX: 2
})
loadSprite("effects", "https://i.ibb.co/gFPf8Kx/IMG-1608.png", {
	sliceX: 3, sliceY: 2,
	anims: {
		boom: {
			from: 1, to: 5,
			speed: 50,
		}
	}
})
loadSprite("explosion", "https://i.ibb.co/YZ9Mwnj/IMG-1638.png", {
	sliceX: 3, sliceY: 2,
	anims: {
		boom: {
			from: 0, to: 5,
			speed: 50
			
		}
	}
})

loadSprite("caveBackground", "https://i.ibb.co/vcjZM3q/IMG-0854.png")
loadSprite("caveForeground", "https://i.ibb.co/MGsDjcC/IMG-1639.png")
loadSprite("logo", "https://i.ibb.co/hcWFJVx/IMG-0864.png")
loadSprite("controls", "https://i.ibb.co/fknspJx/IMG-1880.png")

// constants

const SCALE = width() / 16;

const DARK_COLOR = rgb(20,20,20);
const DARK_COLOR_2 = rgb(40,40,40);
const PROG_BAR_BLUE = rgb(130,180,220);
const PROG_BAR_RED = rgb(200,70,70);

const GRAVITY = 90;
const WALK_SPEED = 8;
const JUMP_FORCE = 16;
const LARGE_JUMP_FORCE = 30;

const ROCKS_PER_ROW = 6;

const AVAILABLE_UPGRADE_SLOTS = {
	'pickStrength': 8,
	'autoMineLoop': 5,
}

const PICK_STRENGTH_BASE_COST = 175;
const AUTO_MINE_BASE_COST = 250;
const PRICE_INCREASE_RATE = {
	'pickStrength': 3,
	'autoMineLoop': 4,
}


const SHOP_BAR_PADDING = 0.1;

const FOREGROUND_BRIGHTNESS = 170;
const BACKGROUND_BRIGHTNESS = 110;


const BLOCK_INFO = {
	'stone': {
		min: 0,
		max: 3,
		reward: 1,
		oreColor: 'no ore',
		shiny: false,
	},
	'iron': {
		min: 6,
		max: 12,
		reward: 10,
		oreColor: rgb(220, 200, 200),
		shiny: false,
	},
	'gold': {
		min: 25,
		max: 64,
		reward: 100,
		oreColor: rgb(255, 200, 0),
		shiny: false,
	},
	'ruby': {
		min: 130,
		max: 250,
		reward: 1000,
		oreColor: rgb(255, 40, 80),
		shiny: false,
	},
	'diamond': {
		min: 700,
		max: 1100,
		reward: 10000,
		oreColor: rgb(150, 255, 255),
		shiny: true,
	}
}


const LAYER_INFO = [
	{
		from: 0, to: 8,
		contents: {
			'stone': 100,
		}
	},
	{
		from: 8, to: 16,
		contents: {
			'stone': 100,
			'iron': 20,
		}
	},
	{
		from: 16, to: 24,
		contents: {
			'stone': 100,
			'iron': 40,
		}
	},
	{
		from: 24, to: 32,
		contents: {
			'stone': 100,
			'iron': 40,
			'gold': 15,
		}
	},
	{
		from: 32, to: 40,
		contents: {
			'stone': 100,
			'iron': 35,
			'gold': 25,
		}
	},
	{
		from: 40, to: 50,
		contents: {
			'stone': 100,
			'iron': 35,
			'gold': 30,
			'ruby': 10
		}
	},
	{
		from: 50, to: 60,
		contents: {
			'stone': 100,
			'iron': 30,
			'gold': 35,
			'ruby': 20
		}
	},
	{
		from: 60, to: 75,
		contents: {
			'stone': 100,
			'iron': 30,
			'gold': 30,
			'ruby': 25,
			'diamond': 5
		}
	},
	{
		from: 75, to: 100,
		contents: {
			'stone': 100,
			'iron': 25,
			'gold': 30,
			'ruby': 30,
			'diamond': 12
		}
	}
]

// save data stuff

let saveData = getData('save', '0,1,1').split(',');

function saveGame() {
	setData('save', `${stats.totalMoney},${stats.pickStrength},${stats.autoMineLoop}`);
}

// stats

var stats = {
	'totalMoney': parseInt(saveData[0]),
	'pickStrength': parseInt(saveData[1]),
	'autoMineLoop': parseInt(saveData[2]),
};
