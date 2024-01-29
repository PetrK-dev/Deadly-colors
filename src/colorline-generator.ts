import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH, ColorineGenSet, Vec, playColors, ColorlineTypes} from './enums-and-constants';
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
		speedLine: 1,
		horizontalChance: 1,
		verticalChance: 0,
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

	onMessage(msg: ECS.Message){
		if(msg.action === Messages.NEW_JUMP){
			const newRandomChance = Math.random();
			if (newRandomChance < this.newLineChance) {
				const typeRandomChance = Math.random();
				if(typeRandomChance < this.genSet.horizontalChance){
					this.generateNewColorline(ColorlineTypes.HORIZONTAL);
				}else if(typeRandomChance <= this.genSet.horizontalChance + this.genSet.verticalChance){
					const verticalRandomChance = Math.random();
					if(verticalRandomChance < 0.5){
						//alert(`VERTICAL_LEFT`);
						this.generateNewColorline(ColorlineTypes.VERTICAL_LEFT);
					}else{
						//alert(`VERTICAL_RIGHT:`);
						this.generateNewColorline(ColorlineTypes.VERTICAL_RIGHT);
					}
				}
				this.newLineChance = this.genSet.newLineMinChance;
			}else{
				this.newLineChance += this.chanceDiff;
			}
		}
		if(msg.action === Messages.LEVEL_UP){
			if(this.inLevel){// toto by melo jit odstranit, staci uz jen volat clear na message
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

	generateNewColorline(lineTypes: ColorlineTypes){
		let color: Colors = this.generateColor();
		let speed: Vec = this.generateSpeed(lineTypes);
		let size: Vec = this.setSize(lineTypes);
		let startPosition: Vec = this.setStartPosition(lineTypes);
		let scrollable: boolean = this.setscrollable(lineTypes);

		this.colorlines.addChild(
			this.createColorline(
				startPosition.x,
				startPosition.y,
				color,
				size.x,
				size.y,
				speed,
				scrollable
			));
	}

	generateColor(): Colors{
		const allColors: Colors[] = playColors;
		let selectedColors = allColors.slice(0, this.genSet.numOfColors);
		selectedColors = selectedColors.filter(color => color !== this.lastColor);

		const randomIndex = Math.floor(Math.random() * selectedColors.length);
		const randomColor = selectedColors.splice(randomIndex, 1)[0];
		this.lastColor = randomColor;
		return randomColor;
	}

	generateSpeed(lineTypes: ColorlineTypes): Vec{
		let speed: Vec = { x: 0, y: 0 };
		if(lineTypes === ColorlineTypes.HORIZONTAL){
			speed.y = Math.random() * this.genSet.speedLine + 1;
		}else if(lineTypes === ColorlineTypes.VERTICAL_LEFT){
			speed.x = Math.random() * this.genSet.speedLine + 1;
		}else if(lineTypes === ColorlineTypes.VERTICAL_RIGHT){
			speed.x = -(Math.random() * this.genSet.speedLine + 1);
		}
		return speed;
	}

	setSize(lineTypes: ColorlineTypes): Vec{
		let size: Vec = { x: 0, y: 0 };
		if(lineTypes === ColorlineTypes.HORIZONTAL){
			size.x = SCENE_WIDTH;
			size.y = this.colLineHeight;
		}else if(lineTypes === ColorlineTypes.VERTICAL_LEFT || lineTypes === ColorlineTypes.VERTICAL_RIGHT){
			size.x = this.colLineHeight;
			size.y = SCENE_HEIGHT;
		}
		return size;
	}

	setStartPosition(lineTypes: ColorlineTypes): Vec{
		let startPosition: Vec = { x: 0, y: 0 };
		if(lineTypes === ColorlineTypes.HORIZONTAL){
			startPosition.x = 0;
			startPosition.y = -75;
		}else if(lineTypes === ColorlineTypes.VERTICAL_LEFT){
			startPosition.x = -this.colLineHeight;
			startPosition.y = 0;
		}else if(lineTypes === ColorlineTypes.VERTICAL_RIGHT){
			startPosition.x = SCENE_WIDTH + this.colLineHeight;
			startPosition.y = 0;
		}
		return startPosition;
	}

	setscrollable(lineTypes: ColorlineTypes): boolean{
		let scrollable: boolean;
		if(lineTypes === ColorlineTypes.HORIZONTAL){
			scrollable = true;
		}else{
			scrollable = false;
		}
		return scrollable;
	}

	createColorline(pos_x: number, pos_y: number, color: Colors, width: number, height: number, speed: Vec, scrollable: boolean): ECS.Graphics {
		let colorline = new ECS.Graphics(Tags.COLORLINE);
		colorline.beginFill(0xFFFFFF);
		colorline.lineStyle(1, 0x000000);
		colorline.drawRect(0, 0, width, height);
		colorline.endFill();
		colorline.position.set( pos_x, pos_y);
		colorline.addComponent(new ColorlineController(speed, scrollable));
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