import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH, ColorineGenSet, Vec} from './enums-and-constants';
import {ColorlineController} from './colorline-controller';


export class ColorlineGenerator extends ECS.Component{
	scene: ECS.Scene;
	colorlines: ECS.Container = new ECS.Container(Tags.COLORLINES);
	colLineHeight: number = 5;
	lastColor: Colors = Colors.START_BALL_COLOR;
	newLineChance: number;
	inLevel: boolean = false;
	chanceDiff: number = 0.05;
	genSet: ColorineGenSet = {
		numOfColors: 3,
		newLineMinChance: 0.5,
		speedLine: 1
	};


	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.clear();
	}

	onInit(){
		this.subscribe(Messages.NEW_JUMP, Messages.LEVEL_UP, Messages.SCROLL);
	}

	clear(){
		this.colorlines.removeChildren();
		this.scene.stage.addChild(this.colorlines);
		this.newLineChance = this.genSet.newLineMinChance;
		this.colLineHeight = SCENE_HEIGHT * 0.00625;
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.NEW_JUMP){
			const randomChance = Math.random();
			if (randomChance < this.newLineChance) {
				this.generateNewColorline(this.genSet.numOfColors);
				this.newLineChance = this.genSet.newLineMinChance;
			}else{
				this.newLineChance += this.chanceDiff;
			}
		}
		if(msg.action === Messages.LEVEL_UP){
			if(this.inLevel){
				this.clear();
				this.inLevel = false;
			}
		}
		if(msg.action === Messages.SCROLL){
			this.inLevel = true;
		}
	}

	onUpdate(delta: number, absolute: number): void {
	}

	setGenerator(colorineGenSet: ColorineGenSet){
		this.genSet = colorineGenSet;
		this.newLineChance = this.genSet.newLineMinChance;
	}

	generateNewColorline(numberOfcolors: number){
		const allColors: Colors[] = [Colors.GREEN, Colors.BLUE, Colors.RED, Colors.YELLOW, Colors.PURPLE];
		let selectedColors = allColors.slice(0, numberOfcolors);
		selectedColors = selectedColors.filter(color => color !== this.lastColor);

		const randomIndex = Math.floor(Math.random() * selectedColors.length);
		const randomColor = selectedColors.splice(randomIndex, 1)[0];
		this.lastColor = randomColor;

		let speed: Vec = { x: 0, y: 2 };
		speed.y = Math.random() * this.genSet.speedLine + 1;

		this.colorlines.addChild(
			this.createColorline(
				0,
				-75,
				randomColor as Colors,
				SCENE_WIDTH,
				this.colLineHeight,
				speed
			));

	}

	createColorline(pos_x: number, pos_y: number, color: Colors, width: number, height: number, speed: Vec): ECS.Graphics {
		let colorline = new ECS.Graphics(Tags.COLORLINE);
		colorline.beginFill(0xFFFFFF);
		colorline.lineStyle(1, 0x000000);
		colorline.drawRect(0, 0, width, height);
		colorline.endFill();
		colorline.position.set( pos_x, pos_y);
		colorline.addComponent(new ColorlineController(speed));
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