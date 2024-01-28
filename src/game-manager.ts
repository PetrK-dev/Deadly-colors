import * as ECS from '../libs/pixi-ecs';
import {GameState, Levels, Messages, Sounds} from './enums-and-constants';
import { Factory } from './factory';
import PIXISound from 'pixi-sound';

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
		Factory.getInstance().loadWelcome();
		PIXISound.stopAll();
		PIXISound.play(Sounds.GAME_OFF, { loop: true, volume:0.2});
		this.gameState = GameState.WELCOME;
		this.sendMessage(Messages.WELCOME);
		this.level = 0;
	}

	onInit(){
		this.subscribe( Messages.GAME_OVER, Messages.LEVEL_UP, Messages.SCROLL );
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.GAME_OVER){
			this.gameState = GameState.GAME_OVER;
			Factory.getInstance().gameOverScreen(this.level);
		}
		if(msg.action === Messages.LEVEL_UP){
			this.level++;
			if(this.level < Levels.length){
				Factory.getInstance().loadLevel(this.level);
			}
			Factory.getInstance().increaseScore(this.level);
		}
	}

	onUpdate(delta: number, absolute: number): void {
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_SPACE)){
			if(this.gameState === GameState.WELCOME && this.keyUp){
				PIXISound.play(Sounds.CLICK, { volume: 0.2});
				Factory.getInstance().readyGame();
				this.gameState = GameState.NEW_GAME;
				this.keyUp = false;
			}
			if(this.gameState === GameState.NEW_GAME && this.keyUp){
				PIXISound.stopAll();
				PIXISound.play(Sounds.CLICK, { volume: 0.2});
				PIXISound.play(Sounds.MAIN, { loop: true, volume:0.2});
				Factory.getInstance().clearScreen();
				this.sendMessage(Messages.GAME_RUN);
				this.gameState = GameState.GAME_RUN;
				this.keyUp = false;
			}
			if(this.gameState === GameState.GAME_OVER && this.keyUp){
				PIXISound.play(Sounds.CLICK, { volume: 0.2});
				this.sendMessage(Messages.NEW_GAME);
				this.gameState = GameState.NEW_GAME;
				Factory.getInstance().restartGame();
				Factory.getInstance().readyGame();
				this.level = 0;
				this.keyUp = false;
				this.inLevel = false;
			}
		}else{
			this.keyUp = true;
		}
	}
}