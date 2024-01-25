import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH} from './enums-and-constants';
import {PlatformController} from './platform-controller';


export class PlatformGenerator extends ECS.Component{
	scene: ECS.Scene;
	platforms: ECS.Container = new ECS.Container(Tags.PLATFORMS);
	lastPlatformLinePosition_y: number;
	numOfColors: number = 3;
	platWidth: number;
	platHeight: number;
	lineStyle: number;
	random_x: boolean = true;

	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.scene.stage.addChild(this.platforms);
		this.platWidth = SCENE_WIDTH / ( 2 * this.numOfColors);
		this.platHeight = SCENE_HEIGHT * 0.013;
		this.lastPlatformLinePosition_y = SCENE_HEIGHT - this.platHeight;
		this.lineStyle = this.platHeight / 2;
		this.random_x = true;
	}

	onInit(){
		this.subscribe(Messages.SCROLL);
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.SCROLL){
			this.lastPlatformLinePosition_y -= msg.data;
			if(this.destoryOldPlatforms()){
				this.generateNewLine();
			}
		}
	}
	setGenerator(numOfColors: number){
		this.numOfColors = numOfColors;
	}
	generateNewLine(){

		const allColors: Colors[] = [Colors.GREEN, Colors.BLUE, Colors.RED, Colors.YELLOW, Colors.PURPLE];
		const selectedColors = allColors.slice(0, this.numOfColors);

		const gapBetweenPlatforms = (SCENE_WIDTH - (this.platWidth * this.numOfColors)) / (this.numOfColors + 1);
		let randomStartPosition_x = 0 + this.platWidth/5;
		let randomEndPosition_x = SCENE_WIDTH - this.platWidth/5*this.numOfColors - this.platWidth*(this.numOfColors);
		let position_x = 0 - this.platWidth;

		for(let i = 0; i < this.numOfColors; i++){

			if(this.random_x){
				randomStartPosition_x = position_x + this.platWidth * 6/5;
				randomEndPosition_x = SCENE_WIDTH - this.platWidth / 5 * (this.numOfColors - i) - this.platWidth * (this.numOfColors - i);
				position_x = Math.floor(Math.random() * (randomEndPosition_x * (0.8 + i * 0.2 / this.numOfColors) - randomStartPosition_x + 1)) + randomStartPosition_x;
			}else{
				position_x = gapBetweenPlatforms + i * (this.platWidth + gapBetweenPlatforms);
			}

			const randomIndex = Math.floor(Math.random() * selectedColors.length);
     		const randomColor = selectedColors.splice(randomIndex, 1)[0];

			this.platforms.addChild(
				this.createPlatform(
					position_x,
					this.lastPlatformLinePosition_y,
					randomColor as Colors,
					this.platWidth,
					this.platHeight
				));
	    }

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
	}

	createPlatform(pos_x: number, pos_y: number, color: Colors, width: number, height: number): ECS.Graphics {
		let platform = new ECS.Graphics(Tags.PLATFORM);
		platform.beginFill(0xFFFFFF);
		platform.lineStyle(this.lineStyle, 0x000000);
		platform.drawRect(0, 0, width, height);
		platform.endFill();
		platform.position.set( pos_x, pos_y);
		platform.addComponent(new PlatformController());
		platform.tint = color;
		return platform;
	}

	destoryOldPlatforms(): Boolean{
		let lineDestroyed = false;
		for (let i = this.platforms.children.length - 1; i >= 0; i--) {
			const platform = this.platforms.children[i] as ECS.Graphics;
			const cBox = platform.getBounds();
			if(cBox.top > SCENE_HEIGHT){
				this.platforms.removeChild(platform);
				lineDestroyed = true;
				//alert(`destroyed: ${lineDestroyed}`);
			}
		}
		return lineDestroyed;
	}

	buildStartPlatforms(): Colors{
		let startPlatformColor: Colors;
		startPlatformColor = this.buildStartPlatform();

		//this.generateNewLine();
		//this.setGenerator(3);

		while(this.lastPlatformLinePosition_y > - 2 * this.platHeight ){
			this.generateNewLine();
		}

		return startPlatformColor;
	}

	buildStartPlatform(): Colors{
		let startPlatformColor: Colors = Colors.RED;

		this.platforms.addChild(
			this.createPlatform(
				0,
				this.lastPlatformLinePosition_y,
				startPlatformColor,
				SCENE_WIDTH,
				this.platHeight
			));

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
		return startPlatformColor;
	}
}