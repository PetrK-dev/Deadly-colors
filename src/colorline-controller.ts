import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, Attrs, Messages, Vec} from './enums-and-constants';
import {Scrollable} from './scrollable';

export class ColorlineController extends Scrollable{
	speed: Vec = { x: 0, y: 2 };

	get color(){
		return this.owner.getAttribute<Colors>(Attrs.COLOR);
	}

	set color(color: Colors){
		this.owner.assignAttribute(Attrs.COLOR, color);
	}

	onInit(){
		super.onInit();
		this.color = this.owner.asGraphics().tint;
		this.speed.y = Math.random() * 3 + 1;
	}

	onMessage(msg: ECS.Message) {
		super.onMessage(msg);
	}

	onUpdate(delta: number, absolute: number) {
		this.owner.position.x += this.speed.x;
		this.owner.position.y += this.speed.y;
	}
}