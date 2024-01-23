import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE} from './enums-and-constants';
import {Tags, Colors} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { CollisionHandler } from './collision-handler';

export class Factory{
	scene: ECS.Scene;
	platformGenerator: PlatformGenerator;

	private static instance: Factory;

	private constructor() { }

	public static getInstance(): Factory {
		if(!Factory.instance) {
			Factory.instance = new Factory();
		}
		return Factory.instance;
	}

	public initialize(scene: ECS.Scene) {
		this.scene = scene;
	}

	newGame(){
		this.scene.addGlobalComponent(new ECS.KeyInputComponent());
		this.scene.addGlobalComponent(new CollisionHandler());
		this.platformGenerator = new PlatformGenerator(this.scene);
	}
	endGame(){}
	restartGame(){}
	buildBall(){
		let ball = new ECS.Graphics(Tags.BALL);
		ball.addTag(Tags.BALL);
		ball.beginFill(0xFFFFFF);
		ball.lineStyle(2, 0x000000);
		ball.drawCircle(0, 0, BALL_SIZE);
		ball.endFill();
		ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		ball.position.set(0.5 * 800 + 15, 0.9 * 600);
		ball.addComponent(new BallController());
		this.scene.stage.addChild(ball);
	}
	buildPlatforms(){
		for(let i = 0; i < 3; i++){
			this.platformGenerator.generateNewLine(3);
		}
	}
	buildStartPlatform(){}
}