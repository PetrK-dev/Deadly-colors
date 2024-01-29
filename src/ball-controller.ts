import * as ECS from '../libs/pixi-ecs';
import {GRAVITY, PLAYER_HORIZONTAL_SPEED, PLAYER_VERTICAL_SPEED, SLIDING, SCENE_WIDTH, SCENE_HEIGHT, Colors, SCROLLING_HEIGHT} from './enums-and-constants';
import {Vec, MoveStates, MoveActions, Messages, Attrs} from './enums-and-constants';

export class BallController extends ECS.Component {
	speed: Vec = { x: 0, y: 0 };

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
	}

	onMessage(msg: ECS.Message): any {
		if(msg.action === Messages.NEW_JUMP) {
			this.newJump();
		}
		if(msg.action === Messages.NEW_COLOR){
			this.updateColor(msg.data);
		}
		if(msg.action === Messages.GAME_RUN) {
			this.moveState = MoveStates.FALL;
		}
	}

	onUpdate(delta: number, absolute: number) {
		this.updateHorizontalMove(delta);
		this.updateVerticalMove(delta);
		this.applyDynamics(delta);
	}

	updateVerticalMove(delta: number){
		if(this.moveState === MoveStates.JUMP || this.moveState === MoveStates.FALL){
			this.speed.y += GRAVITY * delta;
		}else if(this.moveState === MoveStates.STAND){
			this.speed.y = 0;
			this.speed.x = 0;
		}
	}
	updateHorizontalMove(delta: number){
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		const bbox = this.owner.getBounds();

		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_LEFT) || keyInputComponent.isKeyPressed(ECS.Keys.KEY_A)){
			this.speed.x = MoveActions.LEFT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, bbox.left);

		}else if (keyInputComponent.isKeyPressed(ECS.Keys.KEY_RIGHT) || keyInputComponent.isKeyPressed(ECS.Keys.KEY_D)) {
			this.speed.x = MoveActions.RIGHT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, SCENE_WIDTH - bbox.right);

		}else if(this.speed.x > 0){
			if (bbox.right <= SCENE_WIDTH) {
				this.speed.x = MoveActions.RIGHT * Math.min(this.speed.x, SCENE_WIDTH - bbox.right);
			}
		}else if(this.speed.x < 0){
			if (bbox.left >= 0) {
				this.speed.x = MoveActions.LEFT * Math.min(-1 * this.speed.x, bbox.left);
			}
		}
	}

	applyDynamics(delta: number){
		const bbox = this.owner.getBounds();

		if (this.speed.x === 0 && this.speed.y === 0) {
			return;
		}

		//X-part
		this.owner.position.x += this.speed.x;
		this.speed.x *= SLIDING;

		if (Math.abs(this.speed.x) < 0.01) {
			this.speed.x = 0;
		}

		//Y-part
		if(bbox.bottom > SCENE_HEIGHT && this.moveState !== MoveStates.STAND){
			this.gameOver();
		}else if(this.owner.position.y + this.speed.y < SCROLLING_HEIGHT){
			this.owner.position.y = SCROLLING_HEIGHT;
			this.sendMessage(Messages.SCROLL, this.speed.y);
			return;
		}else if( this.speed.y > 0){
			this.moveState = MoveStates.FALL;
		}

		this.owner.position.y += this.speed.y;
	}

	newJump(){
		this.speed.y = -PLAYER_VERTICAL_SPEED;
		this.moveState = MoveStates.JUMP;
	}

	updateColor(newColor: Colors){
		this.owner.asGraphics().tint = newColor;
		this.color = this.owner.asGraphics().tint;
	}

	gameOver(){
		this.moveState = MoveStates.STAND;
		this.sendMessage(Messages.GAME_OVER);
	}
}