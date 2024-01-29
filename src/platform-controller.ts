import * as ECS from '../libs/pixi-ecs';
import {Colors, Attrs} from './enums-and-constants';
import {Scrollable} from './scrollable';

/* //litle idea to future
enum PlatformTypes {
	NOT_MOVING = 0,
	MOVING = 1,
}*/

export class PlatformController extends Scrollable{

	get color(){
		return this.owner.getAttribute<Colors>(Attrs.COLOR);
	}

	set color(color: Colors){
		this.owner.assignAttribute(Attrs.COLOR, color);
	}

	onInit(){
		super.onInit();
		this.color = this.owner.asGraphics().tint;
	}

	onMessage(msg: ECS.Message) {
		super.onMessage(msg);
	}
}