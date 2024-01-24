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
				if(ballColor === platfromColor && ball.getAttribute(Attrs.MOVE_STATE )=== MoveStates.FALL){
					this.sendMessage(Messages.NEW_JUMP);
				}
			}
		}
	}

	checkBallAndColorlines(ball: ECS.Container, colorlines: ECS.Container[]){
		const bbox = ball.getBounds();
		for (let colorline of colorlines) {
			const cBox = colorline.getBounds();
			const vertIntersection = this.vertIntersection(bbox, cBox);

			const collides = vertIntersection >= 0;
			if(collides) {
				let colorlineColor: Colors = colorline.getAttribute(Attrs.COLOR);
				this.sendMessage(Messages.NEW_COLOR, colorlineColor);
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