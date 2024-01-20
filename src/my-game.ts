import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;
const RESOLUTION = 1;
const BALL_SIZE = 10;
const BACK_GROUND_COLOR = 0xFFFFFFF;
const GRAVITY = 0.05;
const PLAYER_VERTICAL_SPEED = 18;
const PLAYER_HORIZONTAL_SPEED = 0.8;
const SLIDING = 0.7;



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

class BallController extends ECS.Component {
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


// TODO rename your game
class MyGame {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			resizeToScreen: true,
			width: SCENE_WIDTH,
			height: SCENE_HEIGHT,
			resolution: RESOLUTION,
			flagsSearchEnabled: false, // searching by flags feature
			statesSearchEnabled: false, // searching by states feature
			tagsSearchEnabled: false, // searching by tags feature
			namesSearchEnabled: true, // searching by names feature
			notifyAttributeChanges: false, // will send message if attributes change
			notifyStateChanges: false, // will send message if states change
			notifyFlagChanges: false, // will send message if flags change
			notifyTagChanges: false, // will send message if tags change
			debugEnabled: false, // debugging window
			backgroundColor: BACK_GROUND_COLOR
		});

		this.engine.app.loader
			.reset()
			.add('ghost', 'assets/ghost.png') // load your assets here
			.load(() => this.load());
	}

	load() {
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		let ball = new ECS.Graphics();
		ball.addTag(Tags.BALL);
		ball.beginFill(0xFFFFFF);
		ball.lineStyle(1, 0x000000);
		ball.drawCircle(0, 0, BALL_SIZE);
		ball.endFill();
		ball.pivot.set(BALL_SIZE/2, BALL_SIZE/2);
		ball.position.set(0.5 * 800 + 15, 0.9 * 600);
		ball.addComponent(new BallController());
		scene.stage.addChild(ball);
	}
}
// this will create a new instance as soon as this file is loaded
export default new MyGame();