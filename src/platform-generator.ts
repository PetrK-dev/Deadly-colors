import * as ECS from '../libs/pixi-ecs';
import {Colors, PLATFORM_HEIGHT_DIF, SCENE_HEIGHT, Tags, Messages, SCENE_WIDTH, PlatformGenSet, playColors} from './enums-and-constants';
import {PlatformController} from './platform-controller';


export class PlatformGenerator extends ECS.Component{
	scene: ECS.Scene;
	platforms: ECS.Container = new ECS.Container(Tags.PLATFORMS);
	lastPlatformLinePosition_y: number;
	platWidth: number;
	platHeight: number;
	platlinesLeft: number = 0;
	nextGenSet: PlatformGenSet = {
		numOfColors: 3,
		numOfPlatlines: 0,
		random_x: 0
	};
	genSet: PlatformGenSet = {
		numOfColors: 3,
		numOfPlatlines: 0,
		random_x: 0
	};


	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.scene.stage.addChild(this.platforms);
		this.platHeight = SCENE_HEIGHT * 0.013;
		this.clear();
	}

	clear(){
		this.platforms.removeChildren();
		this.lastPlatformLinePosition_y = SCENE_HEIGHT - this.platHeight * 1.15;
	}

	onInit(){
		this.subscribe(Messages.SCROLL);
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.SCROLL){
			this.lastPlatformLinePosition_y -= msg.data;
			if(this.removeOldPlatforms()){
				this.createNewPlatforms();
			}
		}
	}

	setGenerator(platformGenSet: PlatformGenSet){
		this.genSet = platformGenSet;
		this.platWidth = SCENE_WIDTH / ( 2 * this.genSet.numOfColors);
	}

	setNextGenerator(platformGenSet: PlatformGenSet){
		this.nextGenSet = platformGenSet;
	}

	createNewPlatforms(){
		if(this.platlinesLeft > 0){
			this.generateNewLine();
			this.platlinesLeft--;
		}else{
			this.buildLevelPlatform();
			this.setGenerator(this.nextGenSet);
			this.platlinesLeft = this.genSet.numOfPlatlines;
		}
	}

	generateNewLine(){
		const allColors: Colors[] = playColors;
		const selectedColors = allColors.slice(0, this.genSet.numOfColors);
		const gapBetweenPlatforms = (SCENE_WIDTH - (this.platWidth * this.genSet.numOfColors)) / (this.genSet.numOfColors + 1);
		let position_x = 0 - this.platWidth;

		for(let i = 0; i < this.genSet.numOfColors; i++){

			position_x = this.generateCoordinate_x(i, position_x, gapBetweenPlatforms);

			const randomIndex = Math.floor(Math.random() * selectedColors.length);
     		const randomColor: Colors = selectedColors.splice(randomIndex, 1)[0];

			this.platforms.addChild(
				this.createPlatform(
					position_x,
					this.lastPlatformLinePosition_y,
					randomColor,
					this.platWidth,
					this.platHeight
				));
	    }

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
	}

	generateCoordinate_x(i: number, position_x: number, gapBetweenPlatforms: number): number{
		if(this.genSet.random_x){
			let randomStartPosition_x = position_x + this.platWidth * 6/5;
			let randomEndPosition_x = SCENE_WIDTH - this.platWidth / 5 * (this.genSet.numOfColors - i) - this.platWidth * (this.genSet.numOfColors - i);
			position_x = Math.floor(Math.random() * (randomEndPosition_x * (0.8 + i * 0.2 / this.genSet.numOfColors) - randomStartPosition_x + 1)) + randomStartPosition_x;
		}else{
			position_x = gapBetweenPlatforms + i * (this.platWidth + gapBetweenPlatforms);
		}
		return position_x;
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

	removeOldPlatforms(): Boolean{
		let platformsRemoved = false;
		for (let i = this.platforms.children.length - 1; i >= 0; i--) {
			const platform = this.platforms.children[i] as ECS.Graphics;
			const cBox = platform.getBounds();
			if(cBox.top > SCENE_HEIGHT){
				this.platforms.removeChild(platform);
				platformsRemoved = true;
			}
		}
		return platformsRemoved;
	}

	buildStartPlatforms(){
		this.buildLevelPlatform();
		this.platlinesLeft = this.genSet.numOfPlatlines;

		while(this.lastPlatformLinePosition_y > - 2 * this.platHeight ){
			this.createNewPlatforms();
		}
	}

	buildLevelPlatform(){
		this.platforms.addChild(
			this.createPlatform(
				0,
				this.lastPlatformLinePosition_y,
				Colors.LEVEL,
				SCENE_WIDTH,
				this.platHeight
			));

		this.lastPlatformLinePosition_y -= PLATFORM_HEIGHT_DIF;
	}
}