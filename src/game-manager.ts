import * as ECS from '../libs/pixi-ecs';
import {GameState, Messages} from './enums-and-constants';
import { Factory } from './factory';
import { SceneManager } from './scene-manager';

export class GameManager extends ECS.Component{
	scene: ECS.Scene;
	gameState: GameState;
	level: number;
	keyInputComponent: ECS.KeyInputComponent;
	keyUp: boolean = true;

	constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		Factory.getInstance().initialize(this.scene);
		Factory.getInstance().newGame();
		this.gameState = GameState.NEW_GAME;
		this.level = 1;
	}

	onInit(){
		this.subscribe( Messages.GAME_OVER, Messages.LEVEL_UP );
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.GAME_OVER){
			this.gameState = GameState.GAME_OVER;
		}
		if(msg.action === Messages.LEVEL_UP){
			this.level++;
			Factory.getInstance().loadLevel(this.level);
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
			}
		}else{
			this.keyUp = true;
		}
	}
}