import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE, PlatformGenSet, ColorineGenSet, Sounds} from './enums-and-constants';
import {Tags, Colors, Attrs, Levels, LvlAttrs} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { ColorlineGenerator } from './colorline-generator';
import { Screener } from './screens';
import PIXISound from 'pixi-sound';

export class Factory{
	scene: ECS.Scene;
	ball: ECS.Graphics;
	score: PIXI.Text;
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

	newGame(level: number = 1){
		this.loadLevel(1);
		this.platformGenerator.buildStartPlatforms();
		this.buildBall();
		this.buildScore(level);
	}
	restartGame(level: number = 1){
		//this.scene.stage.removeChildren();
		this.clear();
		this.newGame(level);
		/*this.loadLevel(level);
		this.platformGenerator.buildStartPlatforms();
		this.buildBall();*/
		/*this.ball.tint = Colors.START_BALL_COLOR;
		this.ball.assignAttribute(Attrs.COLOR, this.ball.tint);
		this.ball.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT - PLATFORM_HEIGHT_DIF + 50);*/
	}

	clear(){
		this.platformGenerator.clear();
		this.colorlineGenerator.clear();
		this.scene.stage.destroyChild(this.ball);
		this.scene.stage.destroyChild(this.score);
		//this.ball.destroy();
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

	buildScore(level: number){
		this.score = this.screener.buildScore(level);
		this.scene.stage.addChild(this.score);
	}

	increaseScore(level: number){
		this.scene.stage.destroyChild(this.score);
		this.score = this.screener.buildScore(level);
		this.scene.stage.addChild(this.score);
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
		PIXISound.stopAll();
		PIXISound.play(Sounds.GAME_OFF, { loop: true, volume:0.2});
		this.platformGenerator.clear();
		this.colorlineGenerator.clear();
		this.screener.gameOverScreen(level);
	}
}