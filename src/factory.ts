import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE} from './enums-and-constants';
import {Tags, Colors, Attrs} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { ColorlineGenerator } from './colorline-generator';
import { CollisionHandler } from './collision-handler';
import { SceneManager } from './scene-manager';
import { GameManager } from './game-manager';

export class Factory{
	scene: ECS.Scene;
	ball: ECS.Graphics;
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

		this.scene.addGlobalComponent(this.platformGenerator);
		this.scene.addGlobalComponent(this.colorlineGenerator);
	}

	newGame(){
		let startColor: Colors;
		startColor = this.platformGenerator.buildStartPlatforms();
		this.buildBall(startColor);
	}
	restartGame(){
		let startColor: Colors;
		this.platformGenerator.clear();
		this.colorlineGenerator.clear();
		startColor = this.platformGenerator.buildStartPlatforms();
		this.ball.tint = startColor;
		this.ball.assignAttribute(Attrs.COLOR, startColor);
		this.ball.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT - PLATFORM_HEIGHT_DIF + 50);
	}
	buildBall(startColor: Colors){
		this.ball = new ECS.Graphics(Tags.BALL);
		this.ball.beginFill(0xFFFFFF);
		this.ball.lineStyle(2, 0x000000);
		this.ball.drawCircle(0, 0, BALL_SIZE);
		this.ball.endFill();
		this.ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		this.ball.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT - PLATFORM_HEIGHT_DIF + 50);
		this.ball.addComponent(new BallController());
		this.ball.tint = startColor;
		this.scene.stage.addChild(this.ball);
	}
	/*
	loadWelcome(){
		alert(`welcome screen : press space`);
	}
	loadTutorial(){
		alert(`tutorial : press space`);
	}
	loadNewGame(){
		alert(`new game : press space`);
	}
	loadGameOver(){
		alert(`game over : press space`);
	}
	*/
}