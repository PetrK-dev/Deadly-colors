import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {MoveActions} from './enums-and-constants';

const PLATFORM_SPEED = 50;

enum PlatformTypes {
	NOT_MOVING = 0,
	MOVING = 1,
}

export class PlatformController extends ECS.Component{
	onUpdate(delta: number, absolute: number): void {
		if(this.owner.stateId = PlatformTypes.MOVING){

		}
	}
}