import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Messages, GRAVITY} from './enums-and-constants';

export class Scrollable extends ECS.Component {

	onInit(){
		this.subscribe(Messages.SCROLL);
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.SCROLL){
			this.owner.position.y -= msg.data;
		}
	}
}