import * as ECS from '../libs/pixi-ecs';
import { SCENE_HEIGHT, SCENE_WIDTH, RESOLUTION } from './enums-and-constants';
import { Colors } from './enums-and-constants';
import { GameManager } from './game-manager';
import { CollisionHandler } from './collision-handler';
import { SoundComponent } from './sound-component';
import { SceneComponent } from './scene-component';
class DeadlyColors {
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
			backgroundColor: Colors.BACK_GROUND_COLOR,
		});

		this.engine.app.loader
			.reset()
			.load(() => this.load());
	}

	load() {
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		scene.addGlobalComponent(new CollisionHandler());
		scene.addGlobalComponentAndRun(new SceneComponent(scene));
		scene.addGlobalComponentAndRun(new SoundComponent());
		scene.addGlobalComponentAndRun(new GameManager(scene));
	}
}
// this will create a new instance as soon as this file is loaded
export default new DeadlyColors();