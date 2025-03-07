import * as ECS from '../libs/pixi-ecs';
import * as PIXI from 'pixi.js';
import {Colors, Messages, SCENE_WIDTH, SCENE_HEIGHT, maxLevel } from './enums-and-constants';
import { bigBlackStyle, redStyle, greenStyle, blueStyle, lowBlackStyle, mediumBlackStyle } from './text-styles';

export class SceneComponent extends ECS.Component{
	screen: ECS.Container;
	scene: ECS.Scene;

	public constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.screen = new ECS.Container;
	}

	onInit(){
		this.subscribe(
			Messages.WELCOME,
			Messages.NEW_GAME,
			Messages.GAME_RUN,
			Messages.GAME_OVER_WITH_SCORE,
			Messages.WIN,
		);
	}

	onMessage(msg: ECS.Message) {
		if(msg.action === Messages.WELCOME){
			this.loadWelcomeScreen();
		}
		if(msg.action === Messages.NEW_GAME){
			this.loadReadyScreen();
		}
		if(msg.action === Messages.GAME_RUN){
			this.clear();
		}
		if(msg.action === Messages.GAME_OVER_WITH_SCORE){
			this.loadGameOverScreen(msg.data);
		}
		if(msg.action === Messages.WIN){
			this.loadWinScreen();
		}
	}

	clear(){
		this.screen.removeChildren();
	}
	loadWelcomeScreen(){
		this.scene.stage.addChild(this.screen);
		this.clear();
		const backgroundScreen = new PIXI.Graphics();
		backgroundScreen.beginFill(Colors.BACKGROUND);
		backgroundScreen.drawRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
		backgroundScreen.endFill();

		const backgroundWelcome = new PIXI.Graphics(); // Barva pozadí kolem textu
		backgroundWelcome.beginFill(Colors.LIGHT_GREY);
		backgroundWelcome.lineStyle(10, 0x000000);
		backgroundWelcome.drawRect(SCENE_WIDTH * 0.1, SCENE_HEIGHT * 0.05, SCENE_WIDTH * 0.8, SCENE_HEIGHT * 0.3);
		backgroundWelcome.endFill();

		const backgroundTutorial = new PIXI.Graphics(); // Barva pozadí kolem textu
		backgroundTutorial.beginFill(Colors.LIGHT_GREY);
		backgroundTutorial.lineStyle(10, 0x000000);
		backgroundTutorial.drawRect(SCENE_WIDTH * 0.1, SCENE_HEIGHT * 0.4, SCENE_WIDTH * 0.8, SCENE_HEIGHT * 0.48);
		backgroundTutorial.endFill();

		const leftArrow = new PIXI.Graphics();
		leftArrow.beginFill(0x000000);
		leftArrow.lineStyle(2, 0x000000);
		leftArrow.drawPolygon([20, 0, 0, 10, 20, 20]);
		leftArrow.endFill();
		leftArrow.pivot.set(5, 20);

		const rightArrow = new PIXI.Graphics();
		rightArrow.beginFill(0x000000);
		rightArrow.lineStyle(2, 0x000000);
		rightArrow.drawPolygon([-20, 0, 0, 10, -20, 20]);
		rightArrow.endFill();
		rightArrow.pivot.set(-5, 20);

		const savePlatform = new ECS.Graphics();
		savePlatform.beginFill(Colors.LEVEL);
		savePlatform.lineStyle(5, 0x000000);
		savePlatform.drawRect(0, 0, 70, 10);
		savePlatform.endFill();

		const colorline = new ECS.Graphics();
		colorline.beginFill(Colors.GREEN);
		colorline.lineStyle(2, 0x000000);
		colorline.drawRect(0, 0, 4, 60);
		colorline.endFill();

		const ballBefore = new ECS.Graphics();
		ballBefore.beginFill(Colors.RED);
		ballBefore.lineStyle(3, 0x000000);
		ballBefore.drawCircle(0, 0, 10);
		ballBefore.endFill();

		const ballAfter  = new ECS.Graphics();
		ballAfter.beginFill(Colors.GREEN);
		ballAfter.lineStyle(3, 0x000000);
		ballAfter.drawCircle(0, 0, 10);
		ballAfter.endFill();

		const platform = new ECS.Graphics();
		platform.beginFill(Colors.GREEN);
		platform.lineStyle(5, 0x000000);
		platform.drawRect(0, 0, 50, 10);
		platform.endFill();

		const firstArrow = new PIXI.Graphics();
		firstArrow.beginFill(0x000000);
		firstArrow.lineStyle(2, 0x000000);
		firstArrow.drawPolygon([-10, 0, 0, 5, -10, 10]);
		firstArrow.endFill();
		firstArrow.pivot.set(-5, 5);

		const secondArrow = new PIXI.Graphics();
		secondArrow.beginFill(0x000000);
		secondArrow.lineStyle(2, 0x000000);
		secondArrow.drawPolygon([-10, 0, 0, 5, -10, 10]);
		secondArrow.endFill();
		secondArrow.pivot.set(-5, 5);

		const ball = new ECS.Graphics();
		ball.beginFill(Colors.GREEN);
		ball.lineStyle(3, 0x000000);
		ball.drawCircle(0, 0, 10);
		ball.endFill();

		// Vytvoření textových objektů
		const welcomeText = new PIXI.Text('Welcome', bigBlackStyle);
		const toText = new PIXI.Text('to', bigBlackStyle);
		const nameText =  new PIXI.Text('Deadly colors!', redStyle);
		const de = new PIXI.Text('De', redStyle);
		const ad = new PIXI.Text('ad', greenStyle);
		const ly = new PIXI.Text('ly ', blueStyle);
		const co = new PIXI.Text('co', redStyle);
		const lo = new PIXI.Text('lo', greenStyle);
		const rs = new PIXI.Text('rs!', blueStyle);
		const warningText = new PIXI.Text('(not suitable for the color blind)', lowBlackStyle);
		const tutorialText = new PIXI.Text('Tutorial', bigBlackStyle);
		const movingText = new PIXI.Text('moving by arrow keys (or A/D)', lowBlackStyle);
		const savePlatformText = new PIXI.Text('level platform', lowBlackStyle);
		const colorLineText = new PIXI.Text('colorline changes color of ball', lowBlackStyle);
		const platformText = new PIXI.Text('jump on platform with same color', lowBlackStyle);
		const gameOver = new PIXI.Text('GAME OVER', lowBlackStyle);
		const gameOverText = new PIXI.Text('don\'t fall down!', lowBlackStyle);
		const win = new PIXI.Text('WIN', lowBlackStyle);
		const winText = new PIXI.Text('go through ' + (maxLevel -1) + ' levels', lowBlackStyle);
		const pressSPace = new PIXI.Text('press SPACE to CONTINUE', mediumBlackStyle);

		welcomeText.x = SCENE_WIDTH / 2 - welcomeText.width / 2;
		welcomeText.y = SCENE_HEIGHT * 0.11;

		toText.x = SCENE_WIDTH / 2 - toText.width / 2;
		toText.y = SCENE_HEIGHT * 0.15;

		de.x = SCENE_WIDTH / 2 - nameText.width / 2;
		de.y = SCENE_HEIGHT * 0.2;
		ad.x = SCENE_WIDTH / 2 - nameText.width / 2 + de.width - 15;
		ad.y = de.y;
		ly.x = SCENE_WIDTH / 2 - nameText.width / 2 + de.width + ad.width - 30;
		ly.y = de.y;
		co.x = SCENE_WIDTH / 2 - nameText.width / 2 + de.width + ad.width + ly.width - 40;
		co.y = de.y;
		lo.x = SCENE_WIDTH / 2 - nameText.width / 2 + de.width + ad.width + ly.width + co.width - 55;
		lo.y = de.y;
		rs.x = SCENE_WIDTH / 2 - nameText.width / 2 + de.width + ad.width + ly.width + co.width + lo.width - 70;
		rs.y = de.y;

		warningText.x = SCENE_WIDTH / 2 - warningText.width / 2 ;
		warningText.y = SCENE_HEIGHT * 0.275;

		tutorialText.x = SCENE_WIDTH / 2 - tutorialText.width / 2 ;
		tutorialText.y = SCENE_HEIGHT * 0.42;

		leftArrow.x = SCENE_WIDTH * 0.22;
		leftArrow.y = SCENE_HEIGHT * 0.525;
		rightArrow.x = SCENE_WIDTH * 0.29;
		rightArrow.y = SCENE_HEIGHT * 0.525;
		movingText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		movingText.y = SCENE_HEIGHT * 0.5;

		savePlatform.x = SCENE_WIDTH * 0.2;
		savePlatform.y = SCENE_HEIGHT * 0.565;
		savePlatformText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		savePlatformText.y = SCENE_HEIGHT * 0.56;

		ballBefore.x = SCENE_WIDTH * 0.2;
		ballBefore.y = SCENE_HEIGHT * 0.635;
		firstArrow.x = SCENE_WIDTH * 0.235;
		firstArrow.y = SCENE_HEIGHT * 0.635;
		colorline.x = SCENE_WIDTH * 0.25;
		colorline.y = SCENE_HEIGHT * 0.60;
		secondArrow.x = SCENE_WIDTH * 0.272;
		secondArrow.y = SCENE_HEIGHT * 0.635;
		ballAfter.x = SCENE_WIDTH * 0.31;
		ballAfter.y = SCENE_HEIGHT * 0.635;
		colorLineText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		colorLineText.y = SCENE_HEIGHT * 0.625;

		ball.x = SCENE_WIDTH * 0.2;
		ball.y = SCENE_HEIGHT * 0.715;
		platform.x = SCENE_WIDTH * 0.25;
		platform.y = SCENE_HEIGHT * 0.708;
		platformText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		platformText.y = SCENE_HEIGHT * 0.70;

		gameOver.x = SCENE_WIDTH * 0.18;
		gameOver.y = SCENE_HEIGHT * 0.77;
		gameOverText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		gameOverText.y = SCENE_HEIGHT * 0.77;

		win.x = SCENE_WIDTH * 0.24;
		win.y = SCENE_HEIGHT * 0.825;
		winText.x = SCENE_WIDTH / 2 - tutorialText.width / 2;
		winText.y = SCENE_HEIGHT * 0.825;

		pressSPace.x = SCENE_WIDTH / 2 - pressSPace.width / 2;
		pressSPace.y = SCENE_HEIGHT * 0.93;

		this.screen.addChild(backgroundScreen);
		this.screen.addChild(backgroundWelcome);
		this.screen.addChild(backgroundTutorial);

		this.screen.addChild(welcomeText);
		this.screen.addChild(toText);
		this.screen.addChild(de, ad, ly, co, lo, rs);

		this.screen.addChild(warningText);

		this.screen.addChild(tutorialText);

		this.screen.addChild(leftArrow);
		this.screen.addChild(rightArrow);
		this.screen.addChild(movingText);

		this.screen.addChild(savePlatform);
		this.screen.addChild(savePlatformText);

		this.screen.addChild(colorline);
		this.screen.addChild(ballBefore);
		this.screen.addChild(ballAfter);
		this.screen.addChild(firstArrow);
		this.screen.addChild(secondArrow);
		this.screen.addChild(colorLineText);

		this.screen.addChild(ball);
		this.screen.addChild(platform);
		this.screen.addChild(platformText);

		this.screen.addChild(gameOver);
		this.screen.addChild(gameOverText);

		this.screen.addChild(win);
		this.screen.addChild(winText);

		this.screen.addChild(pressSPace);
	}
	loadReadyScreen(){
		this.clear();
		const pressSPace = new PIXI.Text('press SPACE to START', mediumBlackStyle);
		pressSPace.x = SCENE_WIDTH / 2 - pressSPace.width / 2;
		pressSPace.y = SCENE_HEIGHT / 2;
		this.screen.addChild(pressSPace);
	}
	loadGameOverScreen(score: number){
		this.clear();
		const backgroundGameOver = new PIXI.Graphics(); // Barva pozadí kolem textu
		backgroundGameOver.beginFill(0xEEEEEE);
		backgroundGameOver.lineStyle(10, 0x000000);
		backgroundGameOver.drawRect(SCENE_WIDTH * 0.1, SCENE_HEIGHT * 0.2  , SCENE_WIDTH * 0.8, SCENE_HEIGHT * 0.4 );
		backgroundGameOver.endFill();

		const gameOver = new PIXI.Text('GAME OVER', bigBlackStyle);
		gameOver.x = SCENE_WIDTH / 2 - gameOver.width / 2;
		gameOver.y = SCENE_HEIGHT * 0.27 ;

		const yourScore = new PIXI.Text('your score: lvl ' + score, bigBlackStyle);
		yourScore.x = SCENE_WIDTH / 2 - yourScore.width / 2;
		yourScore.y = SCENE_HEIGHT * 0.38;

		const playAgain = new PIXI.Text('press SPACE to RESTART LEVEL', mediumBlackStyle);
		playAgain.x = SCENE_WIDTH / 2 - playAgain.width / 2;
		playAgain.y = SCENE_HEIGHT * 0.5;

		const pressRtoLvlOneText = new PIXI.Text('(press R to play from lvl 1)', lowBlackStyle);
		pressRtoLvlOneText.x = SCENE_WIDTH / 2 - pressRtoLvlOneText.width / 2;
		pressRtoLvlOneText.y = SCENE_HEIGHT * 0.54;

		this.screen.addChild(backgroundGameOver);
		this.screen.addChild(gameOver);
		this.screen.addChild(yourScore);
		this.screen.addChild(playAgain);
		this.screen.addChild(pressRtoLvlOneText);
	}

	loadWinScreen(){
		this.clear();
		const backgroundWin = new PIXI.Graphics(); // Barva pozadí kolem textu
		backgroundWin.beginFill(0xEEEEEE);
		backgroundWin.lineStyle(10, 0x000000);
		backgroundWin.drawRect(SCENE_WIDTH * 0.1, SCENE_HEIGHT * 0.2  , SCENE_WIDTH * 0.8, SCENE_HEIGHT * 0.4 );
		backgroundWin.endFill();

		const beatIt = new PIXI.Text('!!!  WIN, YOU BEAT IT  !!!', bigBlackStyle);
		beatIt.x = SCENE_WIDTH / 2 - beatIt.width / 2;
		beatIt.y = SCENE_HEIGHT * 0.27 ;

		const allLevels = new PIXI.Text('gone through all ' + (maxLevel - 1) + ' levels!', bigBlackStyle);
		allLevels.x = SCENE_WIDTH / 2 - allLevels.width / 2;
		allLevels.y = SCENE_HEIGHT * 0.36;

		const comeBack = new PIXI.Text('hope you come back soon to have fun', mediumBlackStyle);
		comeBack.x = SCENE_WIDTH / 2 - comeBack.width / 2;
		comeBack.y = SCENE_HEIGHT * 0.47;

		const challenge = new PIXI.Text('and challenge yoursefl again:)', mediumBlackStyle);
		challenge.x = SCENE_WIDTH / 2 - challenge.width / 2;
		challenge.y = SCENE_HEIGHT * 0.5;

		const playAgain = new PIXI.Text('press SPACE to PLAY AGAIN', lowBlackStyle);
		playAgain.x = SCENE_WIDTH / 2 - playAgain.width / 2;
		playAgain.y = SCENE_HEIGHT * 0.54;

		this.screen.addChild(backgroundWin);
		this.screen.addChild(beatIt);
		this.screen.addChild(allLevels);
		this.screen.addChild(comeBack);
		this.screen.addChild(challenge);
		this.screen.addChild(playAgain);
	}
}