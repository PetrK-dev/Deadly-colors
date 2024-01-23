import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {MoveActions, Colors, Attrs} from './enums-and-constants';

const PLATFORM_SPEED = 50;

enum PlatformTypes {
	NOT_MOVING = 0,
	MOVING = 1,
}

export class PlatformController extends ECS.Component{

	get color(){
		return this.owner.getAttribute<Colors>(Attrs.COLOR);
	}

	set color(color: Colors){
		this.owner.assignAttribute(Attrs.COLOR, color);
	}

	onInit(){
		this.color = this.owner.asGraphics().tint;
	}

	onUpdate(delta: number, absolute: number): void {
		if(this.owner.stateId = PlatformTypes.MOVING){

		}
	}
}