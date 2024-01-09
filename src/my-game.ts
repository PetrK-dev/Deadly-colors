import * as ECS from '../libs/pixi-ecs';

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;
const RESOLUTION = 1;
const BACK_GROUND_COLOR = 0xFFFFFFF;

// TODO rename your game
class MyGame {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			resizeToScreen: true,
			width: SCENE_WIDTH,
			height: SCENE_HEIGHT,
			resolution: RESOLUTION,
			flagsSearchEnabled: false, // searching by flags feature
			statesSearchEnabled: false, // searching by states feature
			tagsSearchEnabled: false, // searching by tags feature
			namesSearchEnabled: true, // searching by names feature
			notifyAttributeChanges: false, // will send message if attributes change
			notifyStateChanges: false, // will send message if states change
			notifyFlagChanges: false, // will send message if flags change
			notifyTagChanges: false, // will send message if tags change
			debugEnabled: false, // debugging window
			backgroundColor: BACK_GROUND_COLOR
		});

		this.engine.app.loader
			.reset()
			.add('ghost', 'assets/ghost.png') // load your assets here
			.load(() => this.load());
	}

	load() {
		// init the scene and run your game

	}
}
// this will create a new instance as soon as this file is loaded
export default new MyGame();