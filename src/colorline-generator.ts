import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH, ColorineGenSet} from './enums-and-constants';
import {ColorlineController} from './colorline-controller';


export class ColorlineGenerator extends ECS.Component{
	scene: ECS.Scene;
	colorlines: ECS.Container = new ECS.Container(Tags.COLORLINES);
	lastColor: Colors;
	numOfColors: number = 3;
	minChanceOfNewLine: number;
	chanceOfNewLine: number;
	chanceDiff: number = 0.05;
	colorineGenSet: ColorineGenSet


	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.clear();
	}

	onInit(){
		this.subscribe(Messages.NEW_JUMP, Messages.GAME_RUN);
	}

	clear(){
		this.colorlines.removeChildren();
		this.scene.stage.addChild(this.colorlines);
		this.minChanceOfNewLine = 0.3;
		this.chanceOfNewLine = this.minChanceOfNewLine;
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.NEW_JUMP){
			const randomChance = Math.random();
			if (randomChance < this.chanceOfNewLine) {
				this.generateNewColorline(this.numOfColors);
				this.chanceOfNewLine = this.minChanceOfNewLine;
			}else{
				this.chanceOfNewLine += this.chanceDiff;
			}
		}
		/*if(msg.action === Messages.GAME_RUN){
			this.generateNewColorline(this.numOfColors);
		}*/
	}

	onUpdate(delta: number, absolute: number): void {
	}

	setGenerator(colorineGenSet: ColorineGenSet){
		this.colorineGenSet = colorineGenSet;
	}

	generateNewColorline(numberOfcolors: number){
		const allColors: Colors[] = [Colors.GREEN, Colors.BLUE, Colors.RED, Colors.YELLOW, Colors.PURPLE];
		let selectedColors = allColors.slice(0, numberOfcolors);
		selectedColors = selectedColors.filter(color => color !== this.lastColor);

		const randomIndex = Math.floor(Math.random() * selectedColors.length);
		const randomColor = selectedColors.splice(randomIndex, 1)[0];
		this.lastColor = randomColor;
		//alert(`Random Color: ${Colors[randomColor]}`);
		this.colorlines.addChild(
			this.createColorline(
				0,
				-100,
				randomColor as Colors,
				SCENE_WIDTH,
				5
			));

	}

	createColorline(pos_x: number, pos_y: number, color: Colors, width: number, height: number): ECS.Graphics {
		let colorline = new ECS.Graphics(Tags.COLORLINE);
		colorline.beginFill(0xFFFFFF);
		colorline.lineStyle(1, 0x000000);
		colorline.drawRect(0, 0, width, height);
		colorline.endFill();
		colorline.position.set( pos_x, pos_y);
		colorline.addComponent(new ColorlineController());
		colorline.tint = color;
		return colorline;
	}

	destoryOldColorlines(){
		for (let i = this.colorlines.children.length - 1; i >= 0; i--) {
			const colorline = this.colorlines.children[i] as ECS.Graphics;
			const cBox = colorline.getBounds();
			if(cBox.top > SCENE_HEIGHT){
				this.colorlines.removeChild(colorline);
			}
		}
	}
}