import * as ECS from '../libs/pixi-ecs';
import PIXISound from 'pixi-sound';
import {Messages, Sounds, getBaseUrl} from './enums-and-constants';

export class SoundComponent extends ECS.Component{
	onInit(): void {
		this.subscribe(
			Messages.WELCOME,
			Messages.GAME_RUN,
			Messages.GAME_OVER,
			Messages.LEVEL_UP,
			Messages.NEW_COLOR,
			Messages.NEW_JUMP,
			Messages.CLICK,
		);
		this.loadSounds();
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.WELCOME){
			PIXISound.stopAll();
			PIXISound.play(Sounds.GAME_OFF, { loop: true, volume:0.2});
		}
		if(msg.action === Messages.GAME_RUN){
			PIXISound.stop(Sounds.GAME_OFF);
			PIXISound.play(Sounds.MAIN, { loop: true, volume:0.2});
		}
		if(msg.action === Messages.GAME_OVER){
			PIXISound.stop(Sounds.MAIN);
			PIXISound.play(Sounds.GAME_OFF, { loop: true, volume:0.2});
		}
		if(msg.action === Messages.LEVEL_UP){
			PIXISound.play(Sounds.LEVEL_UP, { volume:0.3});
		}
		if(msg.action === Messages.NEW_COLOR){
			PIXISound.stop(Sounds.COLOR);
			PIXISound.play(Sounds.COLOR, { volume:0.3});
		}
		if(msg.action === Messages.NEW_JUMP){
			PIXISound.play(Sounds.JUMP, { volume:0.3});
		}
		if(msg.action === Messages.CLICK){
			PIXISound.play(Sounds.CLICK, { volume:0.3});
		}
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