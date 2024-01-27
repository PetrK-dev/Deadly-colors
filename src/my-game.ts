import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE} from './enums-and-constants';
import {Tags, Colors} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { Factory } from './factory';
import { GameManager } from './game-manager';
import { CollisionHandler } from './collision-handler';
import { SceneManager } from './scene-manager';
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
			backgroundColor: Colors.BACK_GROUND_COLOR,
		});

		this.engine.app.loader
			.reset()
			.add('ghost', 'assets/ghost.png') // load your assets here
			.load(() => this.load());
	}

	load() {
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		scene.addGlobalComponent(new CollisionHandler());
		//scene.addGlobalComponentAndRun(new SceneManager(scene));
		//scene.addGlobalComponent(new SceneManager(scene));
		scene.addGlobalComponentAndRun(new GameManager(scene));
	}
}
// this will create a new instance as soon as this file is loaded
export default new MyGame();