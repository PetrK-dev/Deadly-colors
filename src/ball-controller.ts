import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {GRAVITY, PLAYER_HORIZONTAL_SPEED, PLAYER_VERTICAL_SPEED, SLIDING, SCENE_WIDTH, SCENE_HEIGHT, Colors} from './enums-and-constants';
import {Vec, BallMoveStates, MoveActions} from './enums-and-constants';

export class BallController extends ECS.Component {
	speed: Vec = { x: 0, y: 0 };
	gravity: number = GRAVITY;
	ballMoveState: BallMoveStates = BallMoveStates.STAND

	onInit(){
		this.ballMoveState = BallMoveStates.STAND;
	}
	onUpdate(delta: number, absolute: number) {
		this.updateHorizontalMove(delta);
		this.updateVerticalMove(delta);
		this.checkCollisions();
		this.applyDynamics(delta);
	}

	updateVerticalMove(delta: number){
		if(this.ballMoveState === BallMoveStates.JUMP){
			this.speed.y += this.gravity * delta;
		} else if(this.ballMoveState === BallMoveStates.FALL){
			this.speed.y += this.gravity * delta;
		} else if(this.ballMoveState === BallMoveStates.STAND){
			this.speed.y = -PLAYER_VERTICAL_SPEED;
			this.ballMoveState = BallMoveStates.JUMP;
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
			this.ballMoveState = BallMoveStates.JUMP;
		}
		if(this.owner.position.y + this.speed.y > this.owner.position.y){
			this.ballMoveState = BallMoveStates.FALL;
		}
		this.owner.position.y += this.speed.y;
	}

	checkCollisions(){
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_Q)){
    		this.owner.asGraphics().tint = Colors.RED;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_W)){
    		this.owner.asGraphics().tint = Colors.GREEN;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_E)){
    		this.owner.asGraphics().tint = Colors.BLUE;
		}
	}
}