import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Tags, Messages, Colors, Attrs, MoveStates} from './enums-and-constants';


export class CollisionHandler extends ECS.Component {
	onUpdate(delta: number, absolute: number): void {
		const ball = this.scene.findObjectByName(Tags.BALL);
		const platforms = this.scene.findObjectsByName(Tags.PLATFORM);
		const colorlines = this.scene.findObjectsByName(Tags.COLORLINE);

		this.checkBallAndPlatforms(ball, platforms);
		this.checkBallAndColorlines(ball, colorlines);
	}

	checkBallAndPlatforms(ball: ECS.Container, platforms: ECS.Container[]){
		const bbox = ball.getBounds();
		for (let platform of platforms) {
			const cBox = platform.getBounds();
			const horizIntersection = this.horizIntersection(bbox, cBox);
			const vertIntersection = this.vertIntersection(bbox, cBox);

			const collides = horizIntersection >= 0 && vertIntersection >= 0;
			if(collides) {
				let ballColor = ball.getAttribute(Attrs.COLOR);
				let platfromColor = platform.getAttribute(Attrs.COLOR);
				if(( platfromColor === ballColor || platfromColor === Colors.LEVEL || platfromColor === Colors.LEVEL_DONE)
					 && ball.getAttribute(Attrs.MOVE_STATE ) === MoveStates.FALL
				){
					this.sendMessage(Messages.NEW_JUMP);
					if(platfromColor === Colors.LEVEL){
						this.sendMessage(Messages.LEVEL_UP);
						platform.assignAttribute(Attrs.COLOR, Colors.LEVEL_DONE);
					}
				}
			}
		}
	}

	checkBallAndColorlines(ball: ECS.Container, colorlines: ECS.Container[]){
		const bbox = ball.getBounds();
		for (let colorline of colorlines) {
			const cBox = colorline.getBounds();
			const horizIntersection = this.horizIntersection(bbox, cBox);
			const vertIntersection = this.vertIntersection(bbox, cBox);

			const collides = horizIntersection >= 0 && vertIntersection >= 0;
			if(collides) {
				let ballColor: Colors = ball.getAttribute(Attrs.COLOR);
				let colorlineColor: Colors = colorline.getAttribute(Attrs.COLOR);
				if( ballColor!==colorlineColor ){
					this.sendMessage(Messages.NEW_COLOR, colorlineColor);
				}
			}
		}
	}

	private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
	}

	private vertIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
	}
}