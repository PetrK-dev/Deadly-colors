import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE, PlatformGenSet, ColorineGenSet} from './enums-and-constants';
import {Tags, Colors, Attrs, Levels, LvlAttrs} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { ColorlineGenerator } from './colorline-generator';
import { Screener } from './screens';

export class Factory{
	scene: ECS.Scene;
	ball: ECS.Graphics;
	platformGenerator: PlatformGenerator;
	colorlineGenerator: ColorlineGenerator;
	screener: Screener;

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
		this.screener = new Screener();

		this.scene.addGlobalComponent(this.platformGenerator);
		this.scene.addGlobalComponent(this.colorlineGenerator);
	}

	newGame(){
		this.loadLevel(1);
		this.platformGenerator.buildStartPlatforms();
		this.buildBall();
		this.loadWelcome();
	}
	restartGame(level: number = 1){
		//this.scene.stage.removeChildren();
		this.platformGenerator.clear();
		this.colorlineGenerator.clear();
		this.loadLevel(level);
		this.platformGenerator.buildStartPlatforms();
		this.ball.tint = Colors.START_BALL_COLOR;
		this.ball.assignAttribute(Attrs.COLOR, this.ball.tint);
		this.ball.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT - PLATFORM_HEIGHT_DIF + 50);
	}
	buildBall(){
		this.ball = new ECS.Graphics(Tags.BALL);
		this.ball.beginFill(0xFFFFFF);
		this.ball.lineStyle(2, 0x000000);
		this.ball.drawCircle(0, 0, BALL_SIZE);
		this.ball.endFill();
		this.ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		this.ball.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT - PLATFORM_HEIGHT_DIF + 50);
		this.ball.addComponent(new BallController());
		this.ball.tint = Colors.START_BALL_COLOR;
		this.scene.stage.addChild(this.ball);
	}

	loadLevel(level: number){
		let levelSetting: number[] = Levels[level - 1];
		let nextLevelSetting: number[] = Levels[level];

		let platformGenSet: PlatformGenSet = {
			numOfColors: levelSetting[LvlAttrs.NUM_OF_COLORS],
			numOfPlatlines: levelSetting[LvlAttrs.NUM_OF_PLATLINES],
			random_x: levelSetting[LvlAttrs.RANDOM_X]
		};
		this.platformGenerator.setGenerator(platformGenSet);

		let nextPlatformGenSet: PlatformGenSet = {
			numOfColors: nextLevelSetting[LvlAttrs.NUM_OF_COLORS],
			numOfPlatlines: nextLevelSetting[LvlAttrs.NUM_OF_PLATLINES],
			random_x: nextLevelSetting[LvlAttrs.RANDOM_X]
		};
		this.platformGenerator.setNextGenerator(nextPlatformGenSet);

		let colorineGenSet: ColorineGenSet = {
			numOfColors: levelSetting[LvlAttrs.NUM_OF_COLORS],
			newLineMinChance: levelSetting[LvlAttrs.NEW_LINE_CHANCE],
			speedLine: levelSetting[LvlAttrs.LINE_SPEED]
		};
		this.colorlineGenerator.setGenerator(colorineGenSet);
	}

	loadWelcome(){
		this.screener.initialize(this.scene);
		this.screener.welcomeScreen();
	}

	readyGame(){
		this.screener.readyScreen();
	}

	clearScreen(){
		this.screener.clear();
	}

	gameOverScreen(level: number){
		this.screener.gameOverScreen(level);
	}

	score(){
		const score = new ECS.Builder(this.scene)
			.localPos(1, 1)
			.asBitmapText('Score: 0', 'score_font', 2, 0xFFFFFF)
			.withParent(this.scene.stage)
			//.withComponent()
			.build();
	}


}