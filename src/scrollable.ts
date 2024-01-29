import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Messages, GRAVITY, Vec} from './enums-and-constants';

export class Scrollable extends ECS.Component {
	speed: Vec = { x: 0, y: 0 };
	activeScroll: boolean = true;

	onInit(){
		this.subscribe(Messages.SCROLL);
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.SCROLL){
			if(this.activeScroll){
				this.owner.position.y -= msg.data;
			}
		}
	}
}