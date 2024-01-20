import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {GRAVITY, PLAYER_HORIZONTAL_SPEED, PLAYER_VERTICAL_SPEED, SLIDING, SCENE_WIDTH, SCENE_HEIGHT} from './enums-and-constants';

type Vec = {
	x: number;
	y: number;
}

enum BallMoveStates {
	STAND = 'STAND',
	JUMP = 'JUMP',
	FALL = 'FALL',
}

enum PlayerActions {
	RIGHT = 1,
	LEFT = -1,
}

enum Tags{
	BALL = 'BALL',
	COLORING = 'COLORING'
}

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
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_LEFT)){
			this.speed.x = PlayerActions.LEFT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, bbox.left);
		} else if (keyInputComponent.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
			this.speed.x = PlayerActions.RIGHT * Math.min(PLAYER_HORIZONTAL_SPEED * delta, SCENE_WIDTH - bbox.right);
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
    		this.owner.asGraphics().tint = 0xFF0000;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_W)){
    		this.owner.asGraphics().tint = 0x00FF00;
		}
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_E)){
    		this.owner.asGraphics().tint = 0x0000FF;
		}
	}
}