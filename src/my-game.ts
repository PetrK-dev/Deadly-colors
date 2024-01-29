import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {SCENE_HEIGHT, SCENE_WIDTH, PLATFORM_HEIGHT_DIF, RESOLUTION, BACK_GROUND_COLOR, BALL_SIZE, getBaseUrl, Sounds} from './enums-and-constants';
import {Tags, Colors} from './enums-and-constants';
import {BallController} from './ball-controller';
import { PlatformGenerator } from './platform-generator';
import { Factory } from './factory';
import { GameManager } from './game-manager';
import { CollisionHandler } from './collision-handler';
import PIXISound from 'pixi-sound';
import { SoundComponent } from './sound-component';
import { SceneComponent } from './scene-component';
class MyGame {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		const base_url = getBaseUrl();
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
			/*.add('click_sound', './assets/sounds/click.mp4')
			.add('color_sound' ,'./assets/sounds/color.mp4')
			.add('jump_sound', './assets/sounds/color.mp4')
			.add('levelUp_sound', ' ./assets/sounds/color.mp4')
			.add (Sounds.MAIN, './assets/sounds/main_music.wav')*/
			.load(() => this.load());
	}

	load() {
		this.loadSounds();
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		scene.addGlobalComponent(new CollisionHandler());
		scene.addGlobalComponentAndRun(new SceneComponent(scene));
		scene.addGlobalComponentAndRun(new SoundComponent());
		scene.addGlobalComponentAndRun(new GameManager(scene));

	}
	loadSounds(){
		let base_url = `${getBaseUrl()}/assets/sounds`;
		PIXISound.add(Sounds.CLICK ,`${base_url}/click.mp4`);
		PIXISound.add(Sounds.COLOR ,`${base_url}/color.mp4`);
		PIXISound.add(Sounds.JUMP, `${base_url}/jump.mp4`);
		PIXISound.add(Sounds.LEVEL_UP, `${base_url}/levelup.mp4`);
		PIXISound.add (Sounds.MAIN, `${base_url}/main_music.mp4`);
		PIXISound.add (Sounds.GAME_OFF, `${base_url}/music_off_game.mp4`);
	}
}
// this will create a new instance as soon as this file is loaded
export default new MyGame();