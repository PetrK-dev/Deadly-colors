export const SCENE_WIDTH = 600;
export const SCENE_HEIGHT = 800;
export const SCROLLING_HEIGHT = SCENE_HEIGHT/2;
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

export type PlatformGenSet = {
	numOfColors: number;
	numOfPlatlines: number;
	random_x: number;
}

export type ColorineGenSet = {
	numOfColors: number;
	newLineChance: number;
	speedLine: number;
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
	GOLDEN = 0xFFD700,
	LEVEL_COLOR = Colors.GOLDEN,
	START_BALL_COLOR = Colors.RED, //barva musi byt obsazena v barvach platforem ve hre, jinak nelze hrat
}

export enum Messages{
	NEW_JUMP = 'NEW_JUMP',
	SCROLL = 'SCROLL',
	NEW_COLOR = 'NEW_COLOR',
	NEW_GAME = 'NEW_GAME',
	START_GAME = 'START_GAME',
	GAME_OVER = 'GAME_OVER',
	PLAY_AGAIN = 'PLAY_AGAIN',
	WELCOME = 'WELCOME',
	TUTORIAL = 'TUTORIAL',
	GAME_RUN = 'GAME_RUN',
	LEVEL_UP = 'LEVEL_UP',
}

export enum GameState{
	NEW_GAME = 'NEW_GAME',
	START_GAME = 'START_GAME',
	GAME_OVER = 'GAME_OVER',
	PLAY_AGAIN = 'PLAY_AGAIN',
	WELCOME = 'WELCOME',
	TUTORIAL = 'TUTORIAL',
	GAME_RUN = 'GAME_RUN',
}

export enum Attrs{
	COLOR = 'COLOR',
	MOVE_STATE = 'MOVE_STATE',
}

//pocet barev
//pocet platforem,
//nahodne rozmisteni platforem,
//pravdepodobnost nove colorline,
//rychlost colorlines

//pravdepodobnost colorine vertikalni
//pravdepodobnost colorine horizontalni
//pravdepodobnost colorine sikme

export enum LvlAttrs{
	NUM_OF_COLORS,
	NUM_OF_PLATLINES,
	RANDOM_X,
	NEW_LINE_CHANCE ,
	LINE_SPEED,
}

export const Levels = [
	[3, 5, 0, 0.3, 1],
	[4, 5, 1, 0.6, 1.3],
	[3, 5, 0, 0.6, 1],
	[4, 7, 1, 0.6, 1.3],
];
