import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, BALL_SIZE, PlatformGenSet, ColorineGenSet} from './enums-and-constants';
import {Tags, Colors, Levels, LvlAttrs} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { ColorlineGenerator } from './colorline-generator';
import { mediumBlackStyle } from './text-styles';

export class Factory{
	scene: ECS.Scene;
	ball: ECS.Graphics;
	score: PIXI.Text;
	factoryContainer: ECS.Container;
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
		this.factoryContainer = new ECS.Container;
		this.scene.stage.addChild(this.factoryContainer);
		this.platformGenerator = new PlatformGenerator(this.factoryContainer);
		this.colorlineGenerator = new ColorlineGenerator(this.factoryContainer);

		this.scene.addGlobalComponent(this.platformGenerator);
		this.scene.addGlobalComponent(this.colorlineGenerator);
	}

	newGame(level: number = 1){
		this.loadLevel(level);
		this.platformGenerator.buildStartPlatforms();
		this.buildBall();
		this.buildScore(level);
	}

	restartGame(level: number = 1){
		this.clear();
		this.newGame(level);
	}

	clear(){
		this.platformGenerator.clear();
		this.colorlineGenerator.clear();
		this.factoryContainer.destroyChild(this.ball);
		this.factoryContainer.destroyChild(this.score);
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
		this.ball.tint = Colors.START_BALL;
		this.factoryContainer.addChild(this.ball);
	}

	buildScore(level: number){
		this.score = new PIXI.Text('Level:' + level, mediumBlackStyle);
		this.score.x = SCENE_WIDTH * 0.01;
		this.score.y = SCENE_HEIGHT * 0.006;
		this.factoryContainer.addChild(this.score);
	}

	increaseScore(level: number){
		this.factoryContainer.destroyChild(this.score);
		this.buildScore(level);
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
			speedLine: levelSetting[LvlAttrs.LINE_SPEED],
			horizontalChance: levelSetting[LvlAttrs.HOR_COLORLINE_CHANCE],
			verticalChance: levelSetting[LvlAttrs.VER_COLORLINE_CHANCE]
		};
		this.colorlineGenerator.setGenerator(colorineGenSet);
	}
}