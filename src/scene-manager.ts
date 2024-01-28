import * as ECS from '../libs/pixi-ecs';
import {Colors, Messages} from './enums-and-constants';

export class SceneManager extends ECS.Component{

	scene: ECS.Scene;

	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
	}

	onInit(){
		this.subscribe(
			Messages.WELCOME,
			Messages.TUTORIAL,
			Messages.NEW_GAME,
			Messages.GAME_OVER,
		);
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.WELCOME){
			this.loadWelcomeScreen();
		}
		if(msg.action === Messages.TUTORIAL){
			this.loadTutorialScreen();
		}
		if(msg.action === Messages.NEW_GAME){
			this.loadNewGameScreen();
		}
		if(msg.action === Messages.GAME_OVER){
			this.loadGameOverScreen();
		}
	}

	onUpdate(delta: number, absolute: number): void {
		//alert(`bezi to : press space`);
		const keyInputComponent = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		if(keyInputComponent.isKeyPressed(ECS.Keys.KEY_SPACE)){
			this.sendMessage(Messages.NEW_GAME);
		}
	}

	loadWelcomeScreen(){
		alert(`welcome screen : press space`);
	}
	loadTutorialScreen(){
		 alert(`tutorial : press space`);
	}
	loadNewGameScreen(){
		alert(`new game : press space`);
	}
	loadGameOverScreen(){
		alert(`game over : press space`);
	}
}