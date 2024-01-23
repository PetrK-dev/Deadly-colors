import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Tags, Messages} from './enums-and-constants';

export class CollisionHandler extends ECS.Component {
	onUpdate(delta: number, absolute: number): void {
		const ball = this.scene.findObjectByName(Tags.BALL);
		const platforms = this.scene.findObjectsByName(Tags.PLATFORMS);
		//alert(`ball: ${ball}`);
		//alert(`platforms: ${platforms}`);
		/*
		const bbox = ball.getBounds();
		for (let platform of platforms) {
			const cBox = platform.getBounds();
			const horizontal_intersection = this.horizIntersection(bbox, cBox);
			const vertical_intersection = this.vertIntersection(bbox, cBox);
			const topVertIntersection = this.topVertIntersection(ball, cBox);

			const collides_from_top = horizontal_intersection > 0 && topVertIntersection;
			if(collides_from_top) {
				if( platform.asGraphics().tint === ball.asGraphics().tint){
					this.sendMessage(Messages.NEW_JUMP);
				}
			}
		}*/

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