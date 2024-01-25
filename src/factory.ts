import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE} from './enums-and-constants';
import {Tags, Colors} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { ColorlineGenerator } from './colorline-generator';
import { CollisionHandler } from './collision-handler';

export class Factory{
	scene: ECS.Scene;
	platformGenerator: PlatformGenerator;
	colorlineGenerator: ColorlineGenerator;

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
		this.platformGenerator = new PlatformGenerator(this.scene);
		this.colorlineGenerator = new ColorlineGenerator(this.scene);

		this.scene.addGlobalComponent(new ECS.KeyInputComponent());
		this.scene.addGlobalComponent(new CollisionHandler());
		this.scene.addGlobalComponent(this.platformGenerator);
		this.scene.addGlobalComponent(this.colorlineGenerator);
	}

	newGame(){
		let startColor: Colors;
		startColor = this.platformGenerator.buildStartPlatforms();
		this.buildBall(startColor);
	}
	endGame(){
		this.scene.stage.removeChildren();
	}
	restartGame(){
		this.endGame();
		this.newGame();
	}
	buildBall(startColor: Colors){
		let ball = new ECS.Graphics(Tags.BALL);
		ball.beginFill(0xFFFFFF);
		ball.lineStyle(2, 0x000000);
		ball.drawCircle(0, 0, BALL_SIZE);
		ball.endFill();
		ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		ball.position.set(0.5 * 800 + 15, 0.9 * 600);
		ball.addComponent(new BallController());
		ball.tint = startColor;
		this.scene.stage.addChild(ball);
	}
}