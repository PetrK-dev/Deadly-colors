import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Tags, Messages, Colors} from './enums-and-constants';

export class CollisionHandler extends ECS.Component {
	onUpdate(delta: number, absolute: number): void {
		const ball = this.scene.findObjectByName(Tags.BALL);
		const platforms = this.scene.findObjectsByName(Tags.PLATFORM);
		//alert(`ball: ${ball}`);
		//alert(`platforms: ${platforms}`);

		const bbox = ball.getBounds();
		for (let platform of platforms) {
			const cBox = platform.getBounds();
			const horizIntersection = this.horizIntersection(bbox, cBox);
			const vertIntersection = this.vertIntersection(bbox, cBox);
			const topVertIntersection = this.topVertIntersection(ball, cBox);

			const collides = horizIntersection > 0 && vertIntersection > 0;
			if(collides) {
				this.sendMessage(Messages.NEW_JUMP);
			}
		}

	}

	private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
	}

	private vertIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
	}

	private topVertIntersection(ball: ECS.Container, boundsB: PIXI.Rectangle) {
		const bbox = ball.getBounds();
		return (Math.min(bbox.bottom, boundsB.bottom) - Math.max(bbox.top, boundsB.top) ) > 0 && ball.y < boundsB.top;
	}
}