export const SCENE_WIDTH = 800;
export const SCENE_HEIGHT = 600;
export const RESOLUTION = 1;
export const BALL_SIZE = 10;
export const BACK_GROUND_COLOR = 0xFFFFFFF;
export const GRAVITY = 0.02;
export const PLAYER_VERTICAL_SPEED = 13;
export const PLAYER_HORIZONTAL_SPEED = 0.8;
export const SLIDING = 0.7;
export const PLATFORM_HEIGHT_DIF = 150;

export type Vec = {
	x: number;
	y: number;
}

export enum MoveStates {
	STAND = 'STAND',
	JUMP = 'JUMP',
	FALL = 'FALL',
}

export enum MoveActions {
	RIGHT = 1,
	LEFT = -1,
}

export enum Tags{
	BALL = 'BALL',
	COLORING = 'COLORING',
	PLATFORMS = 'PLATFORMS',
	PLATFORM = 'PLATFORM',
	COLORLINE = 'COLORLINE',
	COLORLINES = 'COLORLINES',
}

export enum Colors {
	RED = 0xFF0000,
	BLUE = 0x00AAFF,
	GREEN = 0x00FF00,
	YELLOW = 0xFFFF00,
	PURPLE = 0x800080,
}

export enum Messages{
	NEW_JUMP = 'NEW_JUMP',
	SCROLL = 'SCROLL',
}

export enum Attrs{
	COLOR = 'COLOR',
	MOVE_STATE = 'MOVE_STATE',
}