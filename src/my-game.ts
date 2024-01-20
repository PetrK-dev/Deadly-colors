import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE} from './enums-and-constants';
import {Tags} from './enums-and-constants';
import {BallController} from './ball-controller';
import {PlatformController} from './platform-controller';


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
		this.setBall();
		this.setPlatforms();
	}

	setBall(){
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		let ball = new ECS.Graphics();
		ball.addTag(Tags.BALL);
		ball.beginFill(0xFFFFFF);
		ball.lineStyle(1, 0x000000);
		ball.drawCircle(0, 0, BALL_SIZE);
		ball.endFill();
		ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		ball.position.set(0.5 * 800 + 15, 0.9 * 600);
		ball.addComponent(new BallController());
		scene.stage.addChild(ball);
	}
	setPlatforms(){
		let scene = this.engine.scene;
		let platforms = new ECS.Container('platforms');
		scene.stage.addChild(platforms);
		let pos_y = SCENE_HEIGHT - PLATFORM_HEIGHT_DIF;
		for(let i = 1; i < 7; i+=2){
			let platform = new ECS.Graphics();
			platform.beginFill(0xFF0000);
			platform.lineStyle(1, 0x000000);
			platform.drawRect(0, 0, 800/7, 10);
			platform.endFill();
			platform.position.set( 800/7 * i, pos_y - i * PLATFORM_HEIGHT_DIF);
			platform.addComponent(new PlatformController());
			platforms.addChild(platform);
		}
	}
}
// this will create a new instance as soon as this file is loaded
export default new MyGame();