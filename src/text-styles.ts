import * as PIXI from 'pixi.js';
import { Colors } from './enums-and-constants';

export const bigBlackStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 34,
	fill: 0x000000,
	fontWeight: 'bold',
});

export const mediumBlackStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 25,
	fill: 0x000000,
	fontWeight: 'bold',
});

export const lowBlackStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 16,
	fill: 0x000000,
	fontWeight: 'bold',
});

export const greenStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 40,
	fill: Colors.GREEN,
	fontWeight: 'bold',
	stroke: 0x000000,
	strokeThickness: 6,
	dropShadow: true,
	dropShadowColor: 0x000000,
	dropShadowDistance: 10,
});

export const blueStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 40,
	fill: Colors.BLUE,
	fontWeight: 'bold',
	stroke: 0x000000,
	strokeThickness: 6,
	dropShadow: true,
	dropShadowColor: 0x000000,
	dropShadowDistance: 10,
});

export const redStyle = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 40,
	fill: Colors.RED,
	fontWeight: 'bold',
	stroke: 0x000000,
	strokeThickness: 6,
	dropShadow: true,
	dropShadowColor: 0x000000,
	dropShadowDistance: 10,
});