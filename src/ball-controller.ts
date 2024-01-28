import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {GRAVITY, PLAYER_HORIZONTAL_SPEED, PLAYER_VERTICAL_SPEED, SLIDING, SCENE_WIDTH, SCENE_HEIGHT, Colors, SCROLLING_HEIGHT, Sounds} from './enums-and-constants';
import {Vec, MoveStates, MoveActions, Tags, Messages, Attrs} from './enums-and-constants';
import PIXISound from 'pixi-sound';
export class BallController extends ECS.Component {
	speed: Vec = { x: 0, y: 0 };
	tmpPosition_y: number;

	get color(){
		return this.owner.getAttribute<Colors>(Attrs.COLOR);
	}

	set color(color: Colors){
		this.owner.assignAttribute(Attrs.COLOR, color);
	}

	get moveState(){
		return this.owner.getAttribute<MoveStates>(Attrs.MOVE_STATE);
	}

	set moveState(moveState: MoveStates){
		this.owner.assignAttribute(Attrs.MOVE_STATE, moveState);
	}

	onInit(){
		this.subscribe(Messages.NEW_JUMP, Messages.NEW_COLOR, Messages.GAME_RUN);
		this.moveState = MoveStates.STAND;
		this.color = this.owner.asGraphics().tint;
		this.tmpPosition_y = this.owner.position.y;
	}
	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.NEW_JUMP) {
			PIXISound.play(Sounds.JUMP, {volume:0.2});
			this.speed.y = -PLAYER_VERTICAL_SPEED;
			this.moveState = MoveStates.JUMP;
		}
		if(msg.action === Messages.NEW_COLOR){
			PIXISound.play(Sounds.COLOR, {volume:0.3});
			this.owner.asGraphics().tint = msg.data;
			this.color = this.owner.asGraphics().tint;
			 //alert(`Random Color: ${Colors[randomColor]}`);
		}
		if(msg.action === Messages.GAME_RUN) {
			this.moveState = MoveStates.FALL;
		}
	}

	onUpdate(delta: number, absolute: number) {
		this.updateHorizontalMove(delta);
		this.updateVerticalMove(delta);
		this.checkCollisions();
		this.applyDynamics(delta);
	}

	updateVerticalMove(delta: number){
		if(this.moveState === MoveStates.JUMP){
			this.speed.y += GRAVITY * delta;
		} else if(this.moveState === MoveStates.FALL){
			this.speed.y += GRAVITY * delta;
		} else if(this.moveState === MoveStates.STAND){
			this.speed.y = 0;
			this.speed.x = 0;
		}
	}
	updateHorizontalMove(delta: number){
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		const bbox = this.owner.getBounds();
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_LEFT) || keyInputComponent.isKeyPressed(ECS.Keys.KEY_A)){
			this.speed.x = MoveActions.LEFT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, bbox.left) * 0.8;
		} else if (keyInputComponent.isKeyPressed(ECS.Keys.KEY_RIGHT) || keyInputComponent.isKeyPressed(ECS.Keys.KEY_D)) {
			this.speed.x = MoveActions.RIGHT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, SCENE_WIDTH - bbox.right) * 0.8;
		}
	}

	applyDynamics(delta: number){
		if (this.speed.x === 0 && this.speed.y === 0) {
			return;
		}
		const bbox = this.owner.getBounds();
		this.owner.position.x += this.speed.x;
		this.speed.x *= SLIDING;
		if (Math.abs(this.speed.x) < 0.01) {
			this.speed.x = 0;
		}

		/*else if(this.speed.x < 0 && this.owner.position.x + this.speed.x < this.owner.width/2){
			this.speed.x = 0;
		}else if(this.speed.x > 0 && this.owner.position.x + this.speed.x > SCENE_WIDTH - this.owner.width/2){
			this.speed.x = 0;
		}*/
		/*if(bbox.left >= 0 && bbox.right <= SCENE_WIDTH ){
			this.owner.position.x += this.speed.x;
			this.speed.x *= SLIDING;
			if (Math.abs(this.speed.x) < 0.01) {
				this.speed.x = 0;
			}
		}else{
			if(bbox.left <= 0 ){
				this.owner.position.x = this.owner.width;
				this.speed.x = 0;
			}else{
				this.owner.position.x = SCENE_WIDTH - this.owner.width;
				this.owner.position.x -= this.speed.x;
				this.speed.x = 0;
			}
		}*/
		/*if(this.owner.position.x + this.speed.x < 0){}this.owner.position.x + this.speed.x > SCENE_WIDTH)
		this.owner.position.x += this.speed.x;
		this.speed.x *= SLIDING;
		if (Math.abs(this.speed.x) < 0.01) {
			this.speed.x = 0;
		}

		if(bbox.left >= 0 && bbox.right <= SCENE_WIDTH ){
			this.speed.x = 0
			this.owner.position.x += this.speed.x;
			this.speed.x *= SLIDING;
			if (Math.abs(this.speed.x) < 0.01) {
				this.speed.x = 0;
			}
		}*/

		if(bbox.bottom > SCENE_HEIGHT){
			this.speed.y = -PLAYER_VERTICAL_SPEED;
			this.moveState = MoveStates.STAND;
			this.sendMessage(Messages.GAME_OVER);
		}
		if(this.owner.position.y + this.speed.y < SCROLLING_HEIGHT){
			this.owner.position.y = SCROLLING_HEIGHT;
			this.sendMessage(Messages.SCROLL, this.speed.y);
			return;
		}else if( this.speed.y > 0){
			this.moveState = MoveStates.FALL;
		}
		this.owner.position.y += this.speed.y;
	}

	checkCollisions(){
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_Q)){
    		this.owner.asGraphics().tint = Colors.RED;
			this.color = this.owner.asGraphics().tint;
			this.color = Colors.RED;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_W)){
    		this.owner.asGraphics().tint = Colors.GREEN;
			this.color = this.owner.asGraphics().tint;
			this.color = Colors.GREEN;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_E)){
    		this.owner.asGraphics().tint = Colors.BLUE;
			this.color = this.owner.asGraphics().tint;
			this.color = Colors.BLUE;
		}
	}
}