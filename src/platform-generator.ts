import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags} from './enums-and-constants';
import {PlatformController} from './platform-controller';


export class PlatformGenerator extends ECS.Component{
	lastPlatformLinePosition_y: number = SCENE_HEIGHT - PLATFORM_HEIGHT_DIF;
	platforms: ECS.Container = new ECS.Container(Tags.PLATFORMS);
	scene: ECS.Scene;

	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.scene.stage.addChild(this.platforms);
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
					randomColor,
					100,
					10
				));
	    }

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
	}

	createPlatform(pos_x: number, pos_y: number, color: number, width: number, height: number): ECS.Graphics {
		let platform = new ECS.Graphics(Tags.PLATFORM);
		platform.beginFill(color);
		platform.lineStyle(5, 0x000000);
		platform.drawRect(0, 0, width, height);
		platform.endFill();
		platform.position.set( pos_x, pos_y);
		platform.addComponent(new PlatformController());
		return platform;
	}

	destoryOldLine(){

	}
}