import * as ECS from '../libs/pixi-ecs';
import {Messages, Vec} from './enums-and-constants';

export class Scrollable extends ECS.Component {
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