import * as ECS from '../libs/pixi-ecs';
import {GameState, Levels, Messages, maxLevel} from './enums-and-constants';
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
		this.initialize();
	}

	onInit(){
		this.subscribe( Messages.GAME_OVER, Messages.LEVEL_UP, Messages.SCROLL );
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.GAME_OVER){
			this.gameOver();
		}
		if(msg.action === Messages.LEVEL_UP){
			this.levelUp();
		}
	}

	onUpdate(delta: number, absolute: number): void {
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_SPACE)){
			if(this.gameState === GameState.WELCOME && this.keyUp){
				this.welcomeToNewGame();
			}
			if(this.gameState === GameState.NEW_GAME && this.keyUp){
				this.startGame();
			}
			if(this.gameState === GameState.GAME_OVER && this.keyUp){
				this.restartGame(this.level);
			}
			if(this.gameState === GameState.WIN && this.keyUp){
				this.restartGame(1);
			}
		}else if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_R)){
			if(this.gameState === GameState.GAME_OVER && this.keyUp){
				this.restartGame(1);
			}
		}else{
			this.keyUp = true;
		}
	}

	initialize(){
		Factory.getInstance().initialize(this.scene);
		Factory.getInstance().newGame();
		this.gameState = GameState.WELCOME;
		this.sendMessage(Messages.WELCOME);
		this.level = 0;
	}

	gameOver(){
		this.gameState = GameState.GAME_OVER;
		this.sendMessage(Messages.GAME_OVER_WITH_SCORE, this.level);
	}

	levelUp(){
		this.level++;
		if(this.level !== maxLevel){
			Factory.getInstance().loadLevel(this.level);
		}else{
			this.sendMessage(Messages.WIN);
			this.gameState = GameState.WIN;
			return;
		}
		Factory.getInstance().increaseScore(this.level);
	}

	welcomeToNewGame(){
		this.sendMessage(Messages.CLICK);
		this.sendMessage(Messages.NEW_GAME);
		this.gameState = GameState.NEW_GAME;
		this.keyUp = false;
	}

	startGame(){
		this.sendMessage(Messages.CLICK);
		this.sendMessage(Messages.GAME_RUN);
		this.gameState = GameState.GAME_RUN;
		this.keyUp = false;
	}

	restartGame(level: number){
		this.level = level;
		this.sendMessage(Messages.CLICK);
		this.sendMessage(Messages.NEW_GAME);
		this.gameState = GameState.NEW_GAME;
		Factory.getInstance().restartGame(this.level);
		this.level--;
		this.keyUp = false;
		this.inLevel = false;
	}
}