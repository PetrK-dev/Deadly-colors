export const SCENE_WIDTH = 800;
export const SCENE_HEIGHT = 600;
export const RESOLUTION = 1;
export const BALL_SIZE = 10;
export const BACK_GROUND_COLOR = 0xFFFFFFF;
export const GRAVITY = 0.05;
export const PLAYER_VERTICAL_SPEED = 18;
export const PLAYER_HORIZONTAL_SPEED = 0.8;
export const SLIDING = 0.7;
export const PLATFORM_HEIGHT_DIF = 60;

export type Vec = {
	x: number;
	y: number;
}

export enum BallMoveStates {
	STAND = 'STAND',
	JUMP = 'JUMP',
	FALL = 'FALL',
}

export enum PlayerActions {
	RIGHT = 1,
	LEFT = -1,
}

export enum Tags{
	BALL = 'BALL',
	COLORING = 'COLORING'
}