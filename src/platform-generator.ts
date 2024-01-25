import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH} from './enums-and-constants';
import {PlatformController} from './platform-controller';


export class PlatformGenerator extends ECS.Component{
	lastPlatformLinePosition_y: number = SCENE_HEIGHT - 12;
	platforms: ECS.Container = new ECS.Container(Tags.PLATFORMS);
	scene: ECS.Scene;

	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.scene.stage.addChild(this.platforms);
	}

	onInit(){
		this.subscribe(Messages.SCROLL);
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.SCROLL){
			this.lastPlatformLinePosition_y -= msg.data;
			if(this.destoryOldPlatforms()){
				this.generateNewLine(3);
			}
		}
	}
	setGenerator(){

	}
	generateNewLine(numberOfPlatforms: number){

		const allColors: Colors[] = [Colors.GREEN, Colors.BLUE, Colors.RED, Colors.YELLOW, Colors.PURPLE];
		const selectedColors = allColors.slice(0, numberOfPlatforms);

		for(let i = 0; i < numberOfPlatforms; i++){
			const randomIndex = Math.floor(Math.random() * selectedColors.length);
     		const randomColor = selectedColors.splice(randomIndex, 1)[0];
			 //alert(`Random Color: ${Colors[randomColor]}`);
			this.platforms.addChild(
				this.createPlatform(
					150 + 200 * i,
					this.lastPlatformLinePosition_y,
					randomColor as Colors,
					100,
					10
				));
	    }

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
	}

	createPlatform(pos_x: number, pos_y: number, color: Colors, width: number, height: number): ECS.Graphics {
		let platform = new ECS.Graphics(Tags.PLATFORM);
		platform.beginFill(0xFFFFFF);
		platform.lineStyle(5, 0x000000);
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

		for(let i = 0; i < 4; i++){
			this.generateNewLine(3);
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
				10
			));

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
		return startPlatformColor;
	}
}