import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, Attrs, Messages, Vec} from './enums-and-constants';
import {Scrollable} from './scrollable';

export class ColorlineController extends Scrollable{
	speed: Vec = { x: 0, y: 0 };

	get color(){
		return this.owner.getAttribute<Colors>(Attrs.COLOR);
	}

	set color(color: Colors){
		this.owner.assignAttribute(Attrs.COLOR, color);
	}

	constructor(speed: Vec){
		super();
		this.speed = speed;
	}

	onInit(){
		super.onInit();
		this.subscribe(Messages.GAME_OVER);
		this.color = this.owner.asGraphics().tint;
	}

	onMessage(msg: ECS.Message) {
		super.onMessage(msg);
		if(msg.action === Messages.GAME_OVER){
			this.speed.x = 0;
			this.speed.y = 0;
		}
	}

	onUpdate(delta: number, absolute: number) {
		this.owner.position.x += this.speed.x;
		this.owner.position.y += this.speed.y;
	}
}