export const getBaseUrl = () => (window as any).BASE_URL || '.';
export const SCENE_WIDTH = 600;
export const SCENE_HEIGHT = 800;
export const SCROLLING_HEIGHT = SCENE_HEIGHT/2;
export const RESOLUTION = 1;
export const BALL_SIZE = 10;
export const GRAVITY = 0.025;
export const PLAYER_VERTICAL_SPEED = 14.5;
export const PLAYER_HORIZONTAL_SPEED = 0.7;
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
	newLineMinChance: number;
	speedLine: number;
	horizontalChance: number;
	verticalChance: number;
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
	ORANGE = 0xFF8C00,
	GOLDEN = 0xFFD700,
	GREY = 0xCCCCCC,
	LIGHT_GREY = 0xEEEEEE,
	BLACK = 0X000000,
	LEVEL = Colors.GOLDEN,
	LEVEL_DONE = LEVEL + 1,
	START_BALL = Colors.RED, //barva musi byt obsazena v barvach platforem ve hre, jinak nelze hrat
	BACKGROUND = Colors.GREY,
}

export const playColors: Colors[] = [Colors.GREEN, Colors.BLUE, Colors.RED, Colors.PURPLE, Colors.ORANGE];

export enum Messages{
	NEW_JUMP = 'NEW_JUMP',
	SCROLL = 'SCROLL',
	NEW_COLOR = 'NEW_COLOR',
	NEW_GAME = 'NEW_GAME',
	GAME_OVER = 'GAME_OVER',
	PLAY_AGAIN = 'PLAY_AGAIN',
	WELCOME = 'WELCOME',
	GAME_RUN = 'GAME_RUN',
	LEVEL_UP = 'LEVEL_UP',
	CLICK = 'CLICK',
	GAME_OVER_WITH_SCORE = 'GAME_OVER_WITH_SCORE',
	WIN = 'WIN',
}

export enum GameState{
	NEW_GAME = 'NEW_GAME',
	GAME_OVER = 'GAME_OVER',
	PLAY_AGAIN = 'PLAY_AGAIN',
	WELCOME = 'WELCOME',
	GAME_RUN = 'GAME_RUN',
	WIN = 'WIN',
}

export enum Attrs{
	COLOR = 'COLOR',
	MOVE_STATE = 'MOVE_STATE',
}

export enum Sounds{
	MAIN = 'MAIN',
	JUMP = 'JUMP',
	COLOR = 'COLOR',
	CLICK = 'CLICK',
	LEVEL_UP = 'LEVEL_UP',
	GAME_OFF = 'GAME_OFF',
}

export enum ColorlineTypes{
	HORIZONTAL = 1,
	VERTICAL = 2,
	VERTICAL_LEFT = 3,
	VERTICAL_RIGHT = 4,
}

//pocet barev
//pocet platforem,
//nahodne rozmisteni platforem,
//pravdepodobnost nove colorline,
//rychlost colorlines
//pravdepodobnost horizontalni colorline
//pravdepodobnost vertikalni colorline

export enum LvlAttrs{
	NUM_OF_COLORS,
	NUM_OF_PLATLINES,
	RANDOM_X,
	NEW_LINE_CHANCE,
	LINE_SPEED,
	HOR_COLORLINE_CHANCE,
	VER_COLORLINE_CHANCE,
}

export const Levels = [
	[3, 10, 0, 0.3, 1.0, 1, 0],
	[3, 25, 0, 0.6, 1.3, 1, 0],
	[3, 25, 0, 0.6, 1.8, 1, 0],
	[3, 25, 0, 0.7, 2.0, 1, 0],
	[3, 25, 1, 0.6, 1.3, 1, 0],
	[3, 25, 1, 0.6, 1.9, 1, 0],
	[3, 25, 0, 0.4, 1.0, 0, 1],
	[3, 25, 1, 0.4, 1.2, 0, 1],
	[3, 25, 0, 0.6, 1.3, 0.8, 0.2],
	[3, 25, 1, 0.6, 1.3, 0.7, 0.3],
	[3, 25, 1, 0.7, 1.5, 0.8, 0.2],
	[3, 25, 1, 0.75, 1.8, 0.8, 0.2],
	[4, 10, 0, 0.3, 1.0, 1, 0],
	[4, 25, 0, 0.6, 1.3, 1, 0],
	[4, 25, 0, 0.6, 1.8, 1, 0],
	[4, 25, 0, 0.7, 2.0, 1, 0],
	[4, 25, 1, 0.6, 1.3, 1, 0],
	[4, 25, 1, 0.6, 1.9, 1, 0],
	[4, 25, 0, 0.4, 1.0, 0, 1],
	[4, 25, 1, 0.4, 1.1, 0, 1],
	[4, 25, 0, 0.6, 1.2, 0.8, 0.2],
	[4, 25, 1, 0.6, 1.2, 0.7, 0.3],
	[4, 25, 1, 0.7, 1.4, 0.8, 0.2],
	[4, 25, 1, 0.75, 1.7, 0.8, 0.2],
	[2, 15, 0, 0.6, 1.3, 1, 0],
	[0, 0, 0, 0.0, 0.0, 0, 0],
];

export const maxLevel = Levels.length;