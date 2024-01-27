import * as ECS from '../libs/pixi-ecs';
import {GameState, Levels, Messages} from './enums-and-constants';
import { Factory } from './factory';

export class GameManager extends ECS.Component{
	scene: ECS.Scene;
	gameState: GameState;
	level: number;
	keyInputComponent: ECS.KeyInputComponent;
	keyUp: boolean = true;
	inLevel: boolean = false;

	constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		Factory.getInstance().initialize(this.scene);
		Factory.getInstance().newGame();
		this.gameState = GameState.NEW_GAME;
		this.level = 1;
	}

	onInit(){
		this.subscribe( Messages.GAME_OVER, Messages.LEVEL_UP, Messages.SCROLL );
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.GAME_OVER){
			this.gameState = GameState.GAME_OVER;
		}
		if(msg.action === Messages.LEVEL_UP){
			if(this.inLevel){
				this.level++;
				if(this.level < Levels.length){
					Factory.getInstance().loadLevel(this.level);
				}
				this.inLevel = false;
			}
		}
		if(msg.action === Messages.SCROLL){
			this.inLevel = true;
		}
	}

	onUpdate(delta: number, absolute: number): void {
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_SPACE)){
			if(this.gameState === GameState.NEW_GAME && this.keyUp){
				this.sendMessage(Messages.GAME_RUN);
				this.gameState = GameState.GAME_RUN;
				this.keyUp = false;
			}else if(this.gameState === GameState.GAME_OVER && this.keyUp){
				this.sendMessage(Messages.NEW_GAME);
				this.gameState = GameState.NEW_GAME;
				Factory.getInstance().restartGame();
				this.level = 1;
				this.keyUp = false;
				this.inLevel = false;
			}
		}else{
			this.keyUp = true;
		}
	}
}