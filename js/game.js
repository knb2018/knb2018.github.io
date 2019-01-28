


App = { };




App.Preloader = function (game) { };


App.Preloader.prototype = {

  init: function () {
  
	/*
    if (this.game.device.desktop)
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    else
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	//utils.forceOrientation(this.game, ad_orientation);
	*/
//    this.scale.pageAlignHorizontally = true;
	
  },


  preload: function () {
    
	App.game.stage.backgroundColor = '#7D6239';

    // register your atlases here; the imageLoader will load them up and make those available for creating sprites
    // in the game code without having to worry about which atlas the asset is in
    this.load.atlasJSONHash('assets', 'texture_sheets/assets.png','texture_sheets/assets.json');
	 this.load.image('back', 'img/background/back.jpg');
	 this.load.image('back2', 'img/background/back2.jpg');
	  this.load.image('back1', 'img/background/back1.jpg');
	 	this.load.audio('track1', ['sound/track1.mp3']);
	
  },


  create: function () {
    
	
	 this.state.start('Game');
  },


  update: function () {
  
  },

};




App.Game = function (game) {
  this.params = [];
  this.intro = null;
  this.callToAction = null;
  this.timeSinceLastAction = null;
  this.numLaunched = 0;
  this.originalNumRetries = 0;
  
  
  this.isDebug = false;
};



App.Game.prototype = {



  create: function () {
 	  
	 
	 var self = this;
	  App.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	 App.game.scale.pageAlignHorizontally = true;
        App.game.scale.pageAlignVertically = true;
		

	 
	   this.startGame();
	
		App.game.stage.backgroundColor = '#7D6239';
  },
  

 

  update: function () {
  
	if (this.fieldGroup != null)
	this.fieldGroup.sort('y', Phaser.Group.SORT_ASCENDING);
  
    if (!this.timeSinceLastAction) {
      this.timeSinceLastAction = new Date().getTime();
    }

	if (this.timeStart==0) this.timeStart = new Date().getTime();
	
    var cur_time = new Date().getTime();
	if (this.timeStart>0.5 && this.state>0)
	if (this.timeSinceStart != Math.floor((cur_time-this.timeStart)/1000))
	{
		this.timeSinceStart = Math.floor((cur_time-this.timeStart)/1000);
		this.infoText.text = "Turns: "+this.turnsCount+" Time: "+this.timeSinceStart;
		
	}
	//if (this.m3 != null) this.m3.update();
	
	
  },
  
	
  
	startGame: function()
	{
		
		 VK.init(function() { 
		console.log("VK INIT OK");
		  }, function() { 
			 console.log("VK FAILED");
		}, '5.92'); 
	
	
		this.typeNum="";
		this.bgGroup = this.game.add.group();
		this.bg = this.game.add.sprite(this.game.width/2,this.game.height,'back');
		this.bg.anchor.setTo(0.5,1);
		var bgScale = this.game.width/this.bg.width;
		if (this.game.height/(0.9*this.bg.height)>bgScale) bgScale = this.game.height/(0.9*this.bg.height);
		
		this.bg.scale.setTo(bgScale);
		
		this.bgGroup.add(this.bg);
		this.mainGroup = this.game.add.group();
		
		this.padGroup = this.game.add.group();
	this.fieldGroup = this.game.add.group();
	this.guiGroup = this.game.add.group();
	
	this.mainGroup.add(this.padGroup);
	this.mainGroup.add(this.fieldGroup);
	this.mainGroup.add(this.guiGroup);
	
	this.fieldGroup.x = this.padGroup.x = (1024-768)/2+100;
	this.fieldGroup.y = this.padGroup.y = 220;
		
	
	
	
	this.cellW = 60;
	this.fW = 8;
	this.fScale = 0.5;
	this.cells = [];
	
	this.turnsCount=0;
	this.timeSinceStart = 0;
	this.timeStart = 0.01;
	
	this.statusBack = this.game.add.sprite(this.game.width/2,20,'assets','padback.png');
	this.statusBack.anchor.setTo(0.5,0);
	
	this.statusText = this.game.add.text(this.game.width/2-50,35,"Игрок 1");
	this.statusText.fill ="#FFFFFF";
	this.infoText = this.game.add.text(this.game.width/2-105,70,"Turns: "+this.turnsCount+" Time: "+this.timeSinceStart);
	this.infoText.fill ="#FFFFFF";
	
	this.statusBack.visible = false;
	this.statusText.visible = false;
	this.infoText.visible = false;
	
	this.guiGroup.add(this.statusBack);
	this.guiGroup.add(this.statusText);
	this.guiGroup.add(this.infoText);
	
		
		this.btnBack = this.game.add.sprite(100,20,'assets','brestart.png');
		this.guiGroup.add(this.btnBack);
		this.btnBack.scale.setTo(0.75);
		this.btnBack.tint = 0x888888;
		this.btnBack.inputEnabled = true;
		this.btnBack.events.onInputUp.add(this.clickBtnBack,this);
		
		this.oldUnitsPos = [[],[]];
		this.oldFigCoord = [[[],[],[]],[[],[],[]]];
		this.oldFigCoord1 = [[[],[],[]],[[],[],[]]];
		
		
		this.figData =  [[[],[],[]],[[],[],[]]];
		
		/*
		this.music1 = this.game.add.audio('music1');
		
	this.music1.play();
		this.music1.loop = true;
			*/
		
		//this.NewStartMenu();
		this.music1 = this.game.add.audio('track1');
		if (this.music1 != null) { this.music1.play('',0,1,true); }
		
		//this.NewPauseMenu();
		this.menuFlag = this.game.add.sprite(1024-150,30,'assets','flag.png');
		this.guiGroup.add(this.menuFlag);
		this.menuFlag.inputEnabled = true;
		this.menuFlag.events.onInputUp.add(this.ClickFlag,this);
		
		this.menuFlag.visible = false;
		this.btnBack.visible = false;
		this.shopSet = 0;
		this.NewMainMenu();	
		
	},
	
	ClickNewGame: function()
	{
		if (this.pmGroup != null) this.pmGroup.visible = false;
		if (this.mmGroup != null) this.mmGroup.visible = false;
		
		this.padGroup.visible = false;
		this.fieldGroup.visible = false;
	
		
		this.NewStartMenu();
	
	},
	
	ClickFlag: function()
	{
		if (this.pmGroup != null)
			this.pmGroup.visible = true;
		else
			this.NewPauseMenu();
		this.menuFlag.visible = false;		
		this.btnBack.visible = false;
	
	
	},
	
	ClickResume: function()
	{
		this.pmGroup.visible = false;
		this.menuFlag.visible = true;
		this.btnBack.visible = true;
	},
	
	NewHintWindow: function()
	{
	
	
	},
	
	NewRulesWindow: function()
	{
		
	
	},
	
	ClickEndGame: function()
	{
		this.padGroup.visibile = false;
		this.fieldGroup.visibile = false;
		this.pmGroup.visible = false;
		this.NewMainMenu();
	
	},
	
	NewField: function()
	{
			this.padGroup.visible = true;
		this.fieldGroup.visible = true;
		this.padGroup.removeAll();
		this.fieldGroup.removeAll();
		
		this.fieldGroup.x = this.padGroup.x = 405;
		
		if (this.fW == 5)
		this.fieldGroup.x = this.padGroup.x = 345;
		
		if (this.fW == 6)
		this.fieldGroup.x = this.padGroup.x = 375;
		
		if (this.fW == 7)
		this.fieldGroup.x = this.padGroup.x = 390;
		
		if (this.fW == 9)
		this.fieldGroup.x = this.padGroup.x = 420;
		
		if (this.fW == 10)
		this.fieldGroup.x = this.padGroup.x = 420;
		
		this.fieldGroup.scale.setTo(1.2*8/this.fW);
		this.padGroup.scale.setTo(1.2*8/this.fW);
		
		
		if (this.fW>8)
		this.fieldGroup.y = this.padGroup.y = 310 - 20*(this.fW-8);
		
		
		
		var cW = 195/2;
			var cH = 100/2;
		
		for (var i=0;i<this.fW;i++)
		for (var j=0;j<this.fW;j++)
		{
			var cN = this.shopSet+"";
			if (this.shopSet == 0)  cN="";
		
			var cName = "cell1"+cN+".png";
			if ((i+j) % 2 ==0) cName = "cell"+cN+"2.png";
			//this.cells[i*this.fW+j] =  this.game.add.sprite(i*this.cellW,j*this.cellW,'assets','pad.png');
			this.cells[i*this.fW+j] =  this.game.add.sprite(i*this.cellW,j*this.cellW,'assets',cName);
			this.cells[i*this.fW+j].scale.setTo(0.5);
			//var cW = this.cells[i*this.fW+j].width;
			//var cH = this.cells[i*this.fW+j].height;
			
			this.cells[i*this.fW+j].x =cW/2+ i*cW/2-j*cW/2;
			this.cells[i*this.fW+j].y =i*cH/2+j*cH/2;
			this.padGroup.add(this.cells[i*this.fW+j]);

		}
		
		this.padGroup.sort('y', Phaser.Group.SORT_ASCENDING);
		//this.padGroup.x = (1024-(195/2)*this.fW)/2;
		//this.padGroup.y = 150+this.fW*100/4;
		
		/*
		this.cell1 = this.game.add.sprite(0,(this.fW-1)*this.cellW,'assets','cell1.png');
			this.cell1.x =cW/2+ 0*cW/2-(this.fW-1)*cW/2;
			this.cell1.y =0*cH/2+(this.fW-1)*cH/2;
			this.cell1.scale.setTo(0.5);
		
		this.padGroup.add(this.cell1);
		this.cell1.tint = 0xFFFF66;
		this.cell2 = this.game.add.sprite((this.fW-1)*this.cellW,0,'assets','pad.png');
		
		this.padGroup.add(this.cell2);
		this.cell2.tint = 0xFFFF88;
		*/
		
	
	},
	
	NewPauseMenu: function()
	{
	
		this.pmGroup = this.game.add.group();
		this.pmBack = this.game.add.sprite(0,0,'assets','framePause.png');
		//this.pmBack.scale.setTo(2,2.5);
		this.pmGroup.add(this.pmBack);
		
		this.pmGroup.x = (1024-400)/2;
		this.pmGroup.y =	100;
		this.guiGroup.add(this.pmGroup);
		
		var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
		
		this.pmCB = this.game.add.sprite(62,50,'assets','frameBtn.png');
		this.pmGroup.add(this.pmCB);
		//this.pmCBtext = this.SetBitmapText(120,20,"Продолжить",25);
		this.pmCBtext = this.game.add.text(120,20,"Продолжить",style);
		this.pmCB.addChild(this.pmCBtext);
		this.pmCBtext.x-=this.pmCBtext.width/2;
		this.pmCB.inputEnabled = true;
		this.pmCB.events.onInputUp.add(this.ClickResume,this);
		
		this.pmNB = this.game.add.sprite(62,130,'assets','frameBtn.png');
		this.pmGroup.add(this.pmNB);
		this.pmNBtext = this.game.add.text(120,20,"Новая игра",style);
		this.pmNBtext.x-=this.pmNBtext.width/2;
		
		this.pmNB.addChild(this.pmNBtext);
		this.pmNB.inputEnabled = true;
		this.pmNB.events.onInputUp.add(this.ClickNewGame,this);
		
		this.pmRB = this.game.add.sprite(62,210,'assets','frameBtn.png');
		this.pmGroup.add(this.pmRB);
		this.pmRBtext = this.game.add.text(120,20,"Правила",style);
		this.pmRBtext.x-=this.pmRBtext.width/2;
		this.pmRB.inputEnabled = true;
			this.pmRB.events.onInputUp.add(this.NewHelpWindow,this);
		
		
		this.pmRB.addChild(this.pmRBtext);
		
		this.pmHB = this.game.add.sprite(62,290,'assets','frameBtn.png');
		this.pmGroup.add(this.pmHB);
		this.pmHBtext = this.game.add.text(120,20,"Подсказки",style);
		this.pmHBtext.x-=this.pmHBtext.width/2;
		this.pmHB.inputEnabled = true;
			this.pmHB.events.onInputUp.add(this.NewHintWindow,this);
		
		
		this.pmHB.addChild(this.pmHBtext);
		
		this.pmEB = this.game.add.sprite(62,370,'assets','frameBtn.png');
		this.pmGroup.add(this.pmEB);
		this.pmEBtext = this.game.add.text(120,20,"Закончить игру",style);
		this.pmEBtext.x-=this.pmEBtext.width/2;
		
		this.pmEB.inputEnabled = true;
		this.pmEB.events.onInputUp.add(this.ClickEndGame,this);
		
		this.pmEB.addChild(this.pmEBtext);
		
		
		
		
	
	},
	
	NewHelpWindow: function()
	{
		
		var style = { font: "16px Arial", fill: "#ffffff", align: "left" };
		
		this.hwGroup = this.game.add.group();
		this.hwBack = this.game.add.sprite(0,0,'assets','frameBack.png');
		this.hwGroup.add(this.hwBack);
		
		
		this.hTexts = ["                                                                 Сюжет\nДавным давно, когда люди могли управлять магией, жили два Короля. Их королевства \nрасполагались на большом острове в затерянном ныне месте.\nКороли постоянно воевали между собой. Гибло много войнов и мирных жителей.\nПостоянные пожары набеги на деревни, замки королевства не давали жителям\nнормально обустроиться. Ни один из Королей не хотел уступать другому.\nКаждый хотел владеть всем островом. Прошло сто лет, но войны не прекращались\nкороли постарели, но были сильны и воинственны.\nВ один можно сказать прекрасный день на поле боя, солнце стало ярче, жарче, появился\nСтарец - он был местный маг-волшебник.\nСтарец взмахом своего посоха остановил сражение, все замерли и удивленно смотрели на старца.\n«Хватит» - громко сказал он – «давайте сядем за “стол” переговоров, зароем топор войны,\nвыкурим трубку мира...»","Послышались одобрительные возгласы и все закивали головами. Все устали от войны\nкроме Королей. Короли и два их самых сильных и надежных воина, отправились к месту встречи\nсо Старцем в чистое поле. Но Короли не смоги договориться и поделить остров. \nРазозлив Старца своими спорами и драками между воинами.\nИ Старец сказал им - чтобы народ ваш не страдал, я превратил вас в животных.\nСражайтесь между собой сколько хотите, пока один из вас не останется победителем. Но народ\nваш не будет страдать от непосильных войн. И вот, тот кто станет победителем - сможет снять\nпроклятие с себя и со своих воинов, для того чтобы вернуться в мир к своему народу!\nВозмущенный Старец стукнул о землю посохом и два воина превратились в Быка - упертого\nи вредного, и в Носорога - толстокожего не пробиваемого. Короли перестали спорить и замерли.\nТеперь они не найдут себе места так и хотят по этому полю со своими двумя войнами быком и\nносорогом. Толкаются и пытаются столкнуть друг с поля а, Короли дойти до другого края  острова\nпервым.\nЧтобы опять не началась войнам между королями старец Правила","Правила:\nПеред началом игры нужно выбрать размер поля для игры и количество препятствий на поле\nЦель – довести Короля до противоположного угла поля первым\nИгроки хотят по очереди. За один ход перемещается одна фигура игрока.\n\nВ режиме игры «Случайно» - фигуры для следующего хода выбирается Случайным образом\nВ режиме игры «Игроком» - для следующего хода выбирается  любую фигура игроком\n\nПеремещение фигур и взаимодействие с фигурами соперника\n\nКороль - ходит в любом направлении  на одну клетку\nБык – ходит по горизонтали или вертикали  на одну или две клетки\nНосорог - ходит по диагонали  на одну или две клетки","Взаимодействия фигур на поле:\nНосорог и Бык могут толкать фигуры соперника соответственно правилам игры.\nПосле хода, если рядом с фигурой оказывается фигура соперника, то противник должен\n переместить свою фигуру на одно из доступных полей.\nБык толкает фигуры соперника по диагонали.\nНосорога  толкает фигуры соперника по горизонтали или вертикали.\n\nВзаимодействия фигур и препятствий:\nПортал  - пройдя через портал, персонаж оказывается в противоположном месте поля\n(противоположном относительно центра, если был в левом нижнем углу — переместится в\nправый верхний)\nОзеро   - попадая на поле,  с данным препятствием, фигура не может ходить один ход\nКочки   -  попадая на поле, с данным препятствием, фигура получает права на дополнительный ход"];
		
		this.hwText = this.game.add.text(30,50,this.hTexts[0],style);
		this.hTNum = 0;
		
		this.hwGroup.add(this.hwText);
		
		this.hwGroup.x = (1024-800)/2;
		this.hwGroup.y =	100;
		this.guiGroup.add(this.hwGroup);
		
		this.hwBtn = this.game.add.sprite(262,400,'assets','frameBtn.png');
		this.hwGroup.add(this.hwBtn);
		
		var style2 = { font: "25px Arial", fill: "#ffffff", align: "center" };
		this.hwBtext = this.game.add.text(120,20,"Выйти",style2);
		this.hwBtext.x-=this.hwBtext.width/2;
		this.hwBtn.addChild(this.hwBtext);
		
		this.hwR =  this.game.add.sprite(612,435,'assets','arrow.png');
		this.hwR.anchor.setTo(0.5,0.5);
		this.hwR.scale.setTo(0.3,0.3);
		this.hwGroup.add(this.hwR);
		
		this.hwL =  this.game.add.sprite(162,435,'assets','arrow.png');
		this.hwL.anchor.setTo(0.5,0.5);
		this.hwL.scale.setTo(-0.3,0.3);
		this.hwGroup.add(this.hwL);
		
		
		var self = this;
		
		this.hwBtn.inputEnabled = true;
		this.hwL.inputEnabled = true;
		this.hwR.inputEnabled = true;
		
		
			this.hwL.events.onInputUp.add(function()
			{
				if (self.hTNum>0)
				{
					self.hTNum--;
					self.hwText.text = self.hTexts[self.hTNum];
				}
			},this);
			
			this.hwR.events.onInputUp.add(function()
			{
				if (self.hTNum<2)
				{
					self.hTNum++;
					self.hwText.text = self.hTexts[self.hTNum];
				}
			},this);
		
			this.hwBtn.events.onInputUp.add(function()
			{
				self.hwBtn.inputEnabled = false;
				self.guiGroup.remove(self.hwGroup);
			},this);
	},
	
	NewHintWindow: function()
	{
		var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
		
		this.hwGroup1 = this.game.add.group();
		this.hwBack1 = this.game.add.sprite(0,0,'assets','framePause.png');
		//this.hwBack1.scale.setTo(3,2.5);
		this.hwGroup1.add(this.hwBack1);
		
		this.hwText1 = this.game.add.text(10+120-100,60,"Здесь будет текст подсказок",style);
		this.hwGroup1.add(this.hwText1);
		
		this.hwGroup1.x = (1024-400)/2;
		this.hwGroup1.y =	100;
		this.guiGroup.add(this.hwGroup1);
		
		this.hwBtn1 = this.game.add.sprite(162-100,380,'assets','frameBtn.png');
		this.hwGroup1.add(this.hwBtn1);
		this.hwBtext1 = this.game.add.text(120,20,"Назад",style);
		this.hwBtext1.x-=this.hwBtext1.width/2;
		this.hwBtn1.addChild(this.hwBtext1);
		
		var self = this;
		
		this.hwBtn1.inputEnabled = true;
			this.hwBtn1.events.onInputUp.add(function()
			{
				self.hwBtn1.inputEnabled = false;
				self.guiGroup.remove(self.hwGroup1);
			
			},this);
	
	},
	
	NewAutorsWindow: function()
	{
	
		var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
		
		this.hwGroup2 = this.game.add.group();
		this.hwBack2 = this.game.add.sprite(0,0,'assets','framePause.png');
		//this.hwBack2.scale.setTo(3,2.5);
		this.hwGroup2.add(this.hwBack2);
		
		var dx = -60;
		
		this.hwText2 = this.game.add.text(dx+140,60,"Авторы:\nКатаев Василий\nГерманов Кирилл\nБайбуз Анастасия\nЕлисеев Дмитрий\nШамовский Александр\nМироненко Яна\nДавыдов Николай\nСимигуллина Гульнара",style);
		this.hwGroup2.add(this.hwText2);
		
		this.hwGroup2.x = (1024-400)/2;
		this.hwGroup2.y =	100;
		this.guiGroup.add(this.hwGroup2);
		
		
		
		this.hwBtn2 = this.game.add.sprite(dx+162-20,380,'assets','frameBtn.png');
		this.hwGroup2.add(this.hwBtn2);
		this.hwBtext2 = this.game.add.text(120,20,"Назад",style);
		this.hwBtext2.x-=this.hwBtext2.width/2;
		this.hwBtn2.addChild(this.hwBtext2);
		
		var self = this;
		
		this.hwBtn2.inputEnabled = true;
			this.hwBtn2.events.onInputUp.add(function()
			{
				self.hwBtn2.inputEnabled = false;
				self.guiGroup.remove(self.hwGroup2);
			
			},this);
	
	
	},
	
	NewShopWindow: function()
	{
		var self = this;

			  var callbacksResults = document.getElementById('callbacks');

				
			  VK.addCallback('onOrderSuccess', function(order_id) {
				console.log("OK "+order_id);
				callbacksResults.innerHTML += '<br />onOrderSuccess '+order_id;
				localStorage.setItem("buy","ok");
				
						for (let k=0;k<3;k++) self.ShopChecks[k].frameName = 'check0.png';
					self.ShopChecks[2].frameName = 'check1.png';
					self.bg.destroy();
					self.bg = this.game.add.sprite(this.game.width/2,this.game.height,'back2');
					self.bg.anchor.setTo(0.5,1);
					var bgScale = self.game.width/self.bg.width;
					if (self.game.height/(0.9*self.bg.height)>bgScale) bgScale = self.game.height/(0.9*self.bg.height);
					
					self.bg.scale.setTo(bgScale);
					self.bgGroup.add(self.bg);
				
			  });
			  VK.addCallback('onOrderFail', function() {
				console.log("order_fail");
				callbacksResults.innerHTML += '<br />onOrderFail';
			  });
			  VK.addCallback('onOrderCancel', function() {
				console.log("order_cancel");
				callbacksResults.innerHTML += '<br />onOrderCancel';
			  });
			
	
			this.shBack = this.game.add.sprite(0,0,'assets','frameBack.png');
		
		
		this.shBack.x = (1024-800)/2;
		this.shBack.y =	100;
		this.guiGroup.add(this.shBack);
		
		
		var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
		
		this.S1Title = this.game.add.text(80,50,"Выберите стиль: ",style);
		
		this.shBtn = this.game.add.sprite(280,380,'assets','frameBtn.png');
		this.shBack.addChild(this.S1Title);
		this.shBack.addChild(this.shBtn);
		this.shBtext = this.game.add.text(120,20,"Назад",style);
		this.shBtext.x-=this.shBtext.width/2;
		this.shBtn.addChild(this.shBtext);
		
		this.S1Group = [];
		this.ShopChecks = [];
		this.S1Texts = [];
		let sTexts = ['Средневековье','Гангстеры','Стимпанк'];
		
		
		for (i=0;i<3;i++)
		{
				for (var j=0;j<3;j++)
				{
					var nm = "king";
					if (j==1) nm="bull";
					if (j==2) nm="rhino";
					
					
					if (i>0) nm=nm+i;
					
					let x1 = 360+j*80;	
					let y1 = 70+i*95;
					
					this.S1Texts[i] = this.game.add.text(80,110+i*95,sTexts[i],style);
					this.shBack.addChild(this.S1Texts[i]);
					
					
					this.S1Group[i*3+j] = 	this.game.add.sprite(x1,y1,'assets',nm+'1.png');
					this.S1Group[i*3+j].scale.setTo(0.5);
					this.shBack.addChild(this.S1Group[i*3+j]);	
				}
				
				if (this.shopSet==i)
			this.ShopChecks[i] = 	this.game.add.sprite(280,100+i*95,'assets','check1.png');
			else
			this.ShopChecks[i] = 	this.game.add.sprite(280,100+i*95,'assets','check0.png');
			this.shBack.addChild(this.ShopChecks[i]);		
			
			this.ShopChecks[i].i = i;
			
			
			
			this.ShopChecks[i].inputEnabled = true;
			this.ShopChecks[i].events.onInputUp.add(function(e)
			{
				console.log("SHOP "+e.i);
				self.shopSet = e.i;
			
				if (e.i==0 || e.i ==1)
				{
				
					for (let k=0;k<3;k++) self.ShopChecks[k].frameName = 'check0.png';
					self.ShopChecks[e.i].frameName = 'check1.png';
				
					self.bg.destroy();
					if (e.i==0)
					self.bg = this.game.add.sprite(this.game.width/2,this.game.height,'back');
					else 
					self.bg = this.game.add.sprite(this.game.width/2,this.game.height,'back1');
					self.bg.anchor.setTo(0.5,1);
					var bgScale = self.game.width/self.bg.width;
					if (self.game.height/(0.9*self.bg.height)>bgScale) bgScale = self.game.height/(0.9*self.bg.height);
					
					self.bg.scale.setTo(bgScale);
					self.bgGroup.add(self.bg);
				}
				
				if (e.i==2 )
				{
					if (localStorage.getItem("buy")=="ok")
					{
					for (let k=0;k<3;k++) self.ShopChecks[k].frameName = 'check0.png';
					self.ShopChecks[2].frameName = 'check1.png';
					self.bg.destroy();
					self.bg = this.game.add.sprite(this.game.width/2,this.game.height,'back2');
					self.bg.anchor.setTo(0.5,1);
					var bgScale = self.game.width/self.bg.width;
					if (self.game.height/(0.9*self.bg.height)>bgScale) bgScale = self.game.height/(0.9*self.bg.height);
					
					self.bg.scale.setTo(bgScale);
					self.bgGroup.add(self.bg);
					}
					else
					{
					
					console.log('start PAY');
						var params = {
						  type: 'item',
						  item: 'item_25new'
						};
						//VK.callMethod('showOrderBox', params);
						VK.callMethod("showInviteBox");
					}
				}
			
			},this);
				
		}		
		
		
		var self = this;
		
		this.shBtn.inputEnabled = true;
			this.shBtn.events.onInputUp.add(function()
			{
				self.shBtn.inputEnabled = false;
				self.guiGroup.remove(self.shBack);
				for (let k=0;k<3;k++)
				self.ShopChecks[k].inputEnabled = false;
				self.shBack.destroy();
			
			},this);
		
	
	},	
	
	CloseShopWindow: function()
	{
		this.shBack.destroy();
		
	
	},
	
	
	NewMainMenu: function()
	{
		this.statusText.text = "";
		this.mmGroup = this.game.add.group();
		this.mmBack = this.game.add.sprite(0,0,'assets','framePause.png');
		//this.mmBack.scale.setTo(2,2.5);
		this.mmGroup.add(this.mmBack);
		
		this.mmGroup.x = (1024-400)/2;
		this.mmGroup.y =	100;
		this.guiGroup.add(this.mmGroup);
		
		var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
		
		
		
		this.mmNB = this.game.add.sprite(62,70,'assets','frameBtn.png');
		this.mmGroup.add(this.mmNB);
		this.mmNBtext = this.game.add.text(120,20,"Новая игра",style);
		this.mmNBtext.x-=this.mmNBtext.width/2;
		
		this.mmNB.addChild(this.mmNBtext);
		
		this.mmNB.inputEnabled = true;
			this.mmNB.events.onInputUp.add(this.ClickNewGame,this);
		
		this.mmRB = this.game.add.sprite(62,150,'assets','frameBtn.png');
		this.mmGroup.add(this.mmRB);
		this.mmRBtext = this.game.add.text(120,20,"Правила",style);
		this.mmRBtext.x-=this.mmRBtext.width/2;
		this.mmRB.inputEnabled = true;
			this.mmRB.events.onInputUp.add(this.NewHelpWindow,this);
		
		this.mmRB.addChild(this.mmRBtext);
		
		this.mmHB = this.game.add.sprite(62,290,'assets','frameBtn.png');
		this.mmGroup.add(this.mmHB);
		this.mmHBtext = this.game.add.text(120,20,"Подсказки",style);
		this.mmHBtext.x-=this.mmHBtext.width/2;
		
			//this.mmHB.inputEnabled = true;
			//this.mmHB.events.onInputUp.add(this.NewHintWindow,this);
		
		//this.mmHB.addChild(this.mmHBtext);
		this.mmHB.visible = false;
		
		this.mmEB = this.game.add.sprite(62,240,'assets','frameBtn.png');
		this.mmGroup.add(this.mmEB);
		this.mmEBtext = this.game.add.text(120,20,"Авторы",style);
		this.mmEBtext.x-=this.mmEBtext.width/2;
		
			this.mmEB.inputEnabled = true;
			this.mmEB.events.onInputUp.add(this.NewAutorsWindow,this);
		
		this.mmEB.addChild(this.mmEBtext);
		
		this.mmSB = this.game.add.sprite(62,340,'assets','frameBtn.png');
		this.mmGroup.add(this.mmSB);
		this.mmSBtext = this.game.add.text(120,20,"Магазин",style);
		this.mmSBtext.x-=this.mmSBtext.width/2;
		
		this.mmSB.inputEnabled = true;
			//this.mmSB.events.onInputUp.add(function(){alert('Раздел в разработке');},this);
			this.mmSB.events.onInputUp.add(this.NewShopWindow,this);
		
		this.mmSB.addChild(this.mmSBtext);
		
		
		
		
	
	},
	
	NewStartMenu: function()
	{
		this.state = 0;
		this.statusText.text = "";
		this.fSizeIndex = 3;
		this.fColl0Index = 3;
		this.fColl1Index = 3;
		this.fColl2Index = 3;
		
		/*
		this.smBack = this.game.add.graphics(0,0);
		this.smBack.beginFill(0x888888,1);
		this.smBack.drawRoundedRect(0,0, 800, 500, 20);
		this.smBack.endFill();
		*/
		this.smBack = this.game.add.sprite(0,0,'assets','frameBack.png');
		
		
		this.smBack.x = (1024-800)/2;
		this.smBack.y =	100;
		this.guiGroup.add(this.smBack);
		
		this.fSizeText = this.game.add.text(80,70,"Поле: ");
		
		this.fSizeText.fill ="#FFFFFF";
		this.smBack.addChild(this.fSizeText);
		this.fSizeArray = [];
		for (var i=0;i<6;i++)
		{
			this.fSizeArray[i] = this.game.add.sprite(220+i*(this.cellW+10),50,'assets','pad.png');
			this.fSizeArray[i].i = i;
			this.fSizeArray[i].txt = this.game.add.text(25,20,(i+5)+"");
			this.fSizeArray[i].txt.fill ="#FFFFFF";
			this.fSizeArray[i].addChild(this.fSizeArray[i].txt);
			this.fSizeArray[i].inputEnabled = true;
			this.fSizeArray[i].events.onInputUp.add(this.clickFSize,this);
			this.smBack.addChild(this.fSizeArray[i]);
		}
		
		this.fSizeArray[this.fSizeIndex].tint = 0x0000FF;
		
		this.C0Text = this.game.add.text(80,150,"Доп. ход: ");
		this.C0Text.fill ="#FFFFFF";
		this.smBack.addChild(this.C0Text);
		this.C0Array = [];
		
		for (var i=0;i<6;i++)
		{
			this.C0Array[i] = this.game.add.sprite(250+i*(this.cellW+10),130,'assets','g1.png');
			
			this.C0Array[i].i = i;
			this.C0Array[i].scale.setTo(0.8);
			this.C0Array[i].txt = this.game.add.text(25,20,i+"");
			this.C0Array[i].txt.fill ="#FFFFFF";
			this.C0Array[i].addChild(this.C0Array[i].txt);
			this.C0Array[i].inputEnabled = true;
			this.C0Array[i].events.onInputUp.add(this.clickC0,this);
			this.smBack.addChild(this.C0Array[i]);
		}
		
		this.C0Array[this.fColl0Index].tint = 0x0000FF;
		
		this.C1Text = this.game.add.text(80,230,"Телепорт: ");
		this.C1Text.fill ="#FFFFFF";
		this.smBack.addChild(this.C1Text);
		this.C1Array = [];
		
		for (var i=0;i<6;i++)
		{
			this.C1Array[i] = this.game.add.sprite(250+i*(this.cellW+10),200,'assets','g2.png');
			this.C1Array[i].i = i;
			this.C1Array[i].scale.setTo(0.8);
			this.C1Array[i].txt = this.game.add.text(25,20,i+"");
			this.C1Array[i].txt.fill ="#FFFFFF";
			this.C1Array[i].addChild(this.C1Array[i].txt);
			this.C1Array[i].inputEnabled = true;
			this.C1Array[i].events.onInputUp.add(this.clickC1,this);
			this.smBack.addChild(this.C1Array[i]);
		}
		
		this.C1Array[this.fColl1Index].tint = 0x0000FF;
		
		
		this.C2Text = this.game.add.text(80,310,"Болото: ");
		this.C2Text.fill ="#FFFFFF";
		this.smBack.addChild(this.C2Text);
		this.C2Array = [];
		
		for (var i=0;i<6;i++)
		{
			this.C2Array[i] = this.game.add.sprite(250+i*(this.cellW+10),290,'assets','g3.png');
			this.C2Array[i].i = i;
			this.C2Array[i].scale.setTo(0.6);
			this.C2Array[i].txt = this.game.add.text(25,20,i+"");
			this.C2Array[i].txt.fill ="#FFFFFF";
			this.C2Array[i].addChild(this.C2Array[i].txt);
			this.C2Array[i].inputEnabled = true;
			this.C2Array[i].events.onInputUp.add(this.clickC2,this);
			this.smBack.addChild(this.C2Array[i]);
		}
		
		this.C2Array[this.fColl2Index].tint = 0x0000FF;
	
		this.playText0 =  this.game.add.text(100,410,"Обычный");  
		this.playText0.fill = "#FFFFFF";
		this.bPlay = this.game.add.sprite(270,420,'assets','bplay.png');
		this.smBack.addChild(this.bPlay);
		this.smBack.addChild(this.playText0);
		this.bPlay.scale.setTo(0.6);
		this.bPlay.anchor.setTo(0.5,0.5);
		this.bPlay.inputEnabled = true;
		this.bPlay.events.onInputUp.add(this.clickStartGame,this);
		
		this.bPlayN = this.game.add.sprite(360,405,'assets','bplay.png');
		this.smBack.addChild(this.bPlayN);
		this.bPlayN.scale.setTo(0.6);
		this.bPlayN.anchor.setTo(0.5,0.5);
		this.bPlayN.inputEnabled = true;
		this.bPlayN.tint = 0xFFFF22;
		this.bPlayN.events.onInputUp.add(this.clickStartGameN,this);
		this.bPlayN.visible =false;
		
		this.playText2 =  this.game.add.text(380,405,"Случайный");  
		this.playText2.fill = "#FFFFFF";
		this.bPlay2 = this.game.add.sprite(580,420,'assets','bplay.png');
		this.smBack.addChild(this.bPlay2);
		this.smBack.addChild(this.playText2);
		this.bPlay2.scale.setTo(0.6);
		this.bPlay2.anchor.setTo(0.5,0.5);
		this.bPlay2.inputEnabled = true;
		this.bPlay2.events.onInputUp.add(this.clickStartGame2,this);
		this.bPlayN2 = this.game.add.sprite(683,450,'assets','bplay.png');
		this.smBack.addChild(this.bPlayN2);
		this.bPlayN2.scale.setTo(0.6);
		this.bPlayN2.anchor.setTo(0.5,0.5);
		this.bPlayN2.inputEnabled = true;
		this.bPlayN2.tint = 0xFFFF22;
		this.bPlayN2.events.onInputUp.add(this.clickStartGame2N,this);
		this.bPlayN2.visible =false;
		
		
		this.randomMode = 0;
		this.kingNoPushMode = 1;
		this.kingWasPushed = [0,0];
		this.oldKingPushed = [0,0]
		
	},
	
	clickStartGameN: function()
	{
		this.kingNoPushMode = 1;
		this.clickStartGame();
	},
	
	clickStartGame2: function()
	{
		this.randomMode = 1;
		this.clickStartGame();
	},
	
	clickStartGame2N: function()
	{
		this.randomMode = 1;
		this.kingNoPushMode = 1;
		this.clickStartGame();
	},
	
	clickStartGame: function()
	{
		if ((this.fW-2)*(this.fW-2)<this.fColl0Index+2*this.fColl1Index+this.fColl2Index)
		{
			alert("Слишком много препятствий");
		}
		else
		{
			this.guiGroup.remove(this.smBack);
			this.smBack.destroy();
			this.NewField();
			this.NewNPC();
			this.timeStart = 0;
		}
		
			this.menuFlag.visible = true;
			
	},	
	
	clickC0: function(e)
	{
		this.fColl0Index =e.i;
		 
		for (var i=0;i<6;i++)
			if (i == this.fColl0Index)
				this.C0Array[i].tint = 0x0000FF;
			else 	
				this.C0Array[i].tint = 0xFFFFFF;
	},
	
	
	clickC1: function(e)
	{
		this.fColl1Index =e.i;
		 
		for (var i=0;i<6;i++)
			if (i == this.fColl1Index)
				this.C1Array[i].tint = 0x0000FF;
			else 	
				this.C1Array[i].tint = 0xFFFFFF;
	},
	
	
	clickC2: function(e)
	{
		this.fColl2Index =e.i;
		 
		for (var i=0;i<6;i++)
			if (i == this.fColl2Index)
				this.C2Array[i].tint = 0x0000FF;
			else 	
				this.C2Array[i].tint = 0xFFFFFF;
	},
	
	clickFSize: function(e)
	{
		
		this.fSizeIndex = e.i;
		
		for (var i=0;i<6;i++)
		{
			if (i == this.fSizeIndex)
				this.fSizeArray[i].tint = 0x0000FF;
			else 	
				this.fSizeArray[i].tint = 0xFFFFFF;
		}	
		
		this.fW = this.fSizeIndex+5;
	},	
	
	clickBtnBack: function()
	{
		if (this.state==1 && this.oldFigCoord1[0][0].length>0 && this.shiftState != 1)
		this.GetOldData();
	},
	
	GetOldData: function()
	{
		//alert(this.oldFigCoord1);
		this.btnBack.tint = 0x888888;
		
		console.log("OK: "+this.oldKingPushed);
		
		for (var i=0;i<2;i++)
		this.kingWasPushed[i] = this.oldKingPushed[i];
		
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
			{
				this.units[i][j].x1 = this.oldFigCoord1[i][j][0];
				this.units[i][j].y1 = this.oldFigCoord1[i][j][1];
				this.units[i][j].alpha  =this.oldFigCoord1[i][j][2];
				this.units[i][j].scale.setTo(this.fScale,this.oldFigCoord1[i][j][3]);
				if (i==0) 
				{
					this.units[i][j].inputEnabled  =(this.units[i][j].scale.y==this.fScale)?true:false;
				}
				
				this.units[i][j].tint  =this.oldFigCoord1[i][j][4];
				
				//this.units[i][j].x = this.units[i][j].x1*this.cellW;
				//this.units[i][j].y = this.units[i][j].y1*this.cellW;
				this.units[i][j].x = this.GetX(this.units[i][j].x1,this.units[i][j].y1);
				this.units[i][j].y = this.GetY(this.units[i][j].x1,this.units[i][j].y1);
				
				for (var k=0;k<5;k++)
					this.oldFigCoord[i][j][k] =  this.oldFigCoord1[i][j][k];
				
				this.oldFigCoord1[i][j] = [];
		}	

		if (this.randomMode ==1)
		{	
			var rndID = this.oldRndID;
			this.SetFigName(rndID);
			this.rndID = rndID;
			this.oldRndID = null;
		}
		
	},
	
	GetX: function(i,j)
	{
		var cW = 195/2;
		var cH = 100/2;
			
		return cW/2+ i*cW/2-j*cW/2+cW/4;
			//cell.y =i*cH/2+j*cH/2;
	},
	
	GetY: function(i,j)
	{
		var cW = 195/2;
		var cH = 100/2;
		return i*cH/2+j*cH/2 - cH/4;
	},
	
	NewNPC: function()
	{
		this.gameState = 0;
		this.hintCells = [];
		var n = this.fW;
		
		var figCoord = [[[0,n-1],[1,n-1],[0,n-2]],[[n-1,0],[n-1,1],[n-2,0]]];
		//var figCoord = [[[n-4,3],[1,n-1],[0,n-2]],[[n-1,n-1],[n-1,1],[n-2,0]]];
		//var figCoord = [[[0,n-1],[2,n-1],[0,n-3]],[[n-1,0],[n-1,2],[n-3,0]]];
		
		this.units = [[],[]];
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			var x1 = figCoord[i][j][0];
			var y1 = figCoord[i][j][1];
			
			var nm = "king";
			if (j==1) nm="bull";
			if (j==2) nm="rhino";
			
			if (this.shopSet>0) nm=nm+this.shopSet;
			
			
			
			this.units[i][j] = 	this.game.add.sprite(x1*this.cellW,y1*this.cellW,'assets',nm+(i+1)+'.png');
			this.units[i][j].x  =this.GetX(x1,y1);
			this.units[i][j].y  =this.GetY(x1,y1);
			
			
			if (j>0)
			{
				this.units[i][j].anchor.setTo(0,0.4);
				if (i>0) this.units[i][j].anchor.setTo(0.2,0.4); 
			}
			else
			{	
				if (i>0)
					this.units[i][j].anchor.setTo(0.2,0.5);
				else
					this.units[i][j].anchor.setTo(0.3,0.5);
			}
			
			
			this.units[i][j].scale.setTo(this.fScale)
			
			this.units[i][j].shadow = this.game.add.sprite(0,0,
			'assets',nm+(i+1)+'.png');
			
			if (j>0)
			this.units[i][j].shadow.anchor.setTo(0,0.4);
			else
			this.units[i][j].shadow.anchor.setTo(0.3,0.5);
			
			this.units[i][j].addChild(this.units[i][j].shadow);
			this.units[i][j].shadow.alpha = 0;
			this.units[i][j].shadow.tint = 0x000000;
			this.units[i][j].pN = i;
			this.units[i][j].figN = j;
			this.units[i][j].x1 = x1;
			this.units[i][j].y1 = y1;
			this.units[i][j].inputEnabled = true;
			this.units[i][j].cNum = 0;
			
    this.units[i][j].input.enableDrag();
    this.units[i][j].events.onDragStart.add(this.onDragStart, this);
    this.units[i][j].events.onDragStop.add(this.onDragStop, this);

			this.fieldGroup.add(this.units[i][j]);
			
			this.units[i][j].inputEnabled = false;
			if (i==0)
			this.units[i][j].inputEnabled = true;
		}
	
		this.collis = [];
		
		this.collisType = [];
		
		if (this.fColl0Index>0)
		for (var i=0;i<this.fColl0Index;i++) this.collisType.push(0);
		
		if (this.fColl1Index>0)
		for (var i=0;i<this.fColl1Index;i++) this.collisType.push(1);
		
		if (this.fColl2Index>0)
		for (var i=0;i<this.fColl2Index;i++) this.collisType.push(2);
		
		
		this.collisFreeCells = [];
		for (var i=0;i<(this.fW-2)*(this.fW-2);i++)
		{
			this.collisFreeCells.push(i);
		}
		
		
		
		if (this.collisType.length>0)
		for (var i=0;i<this.collisType.length;i++)
		{
			var ind0 = Math.floor(Math.random()*this.collisFreeCells.length);
			var dx1 = Math.floor(this.collisFreeCells[ind0]/(this.fW-2));
			var dy1= this.collisFreeCells[ind0] %(this.fW-2);
			var x1 = 1+dx1;
			var y1 = 1+dy1;
				
			while (x1==y1 && x1==Math.floor(this.fW/2) && this.fW % 2==1)
			{			
				ind0 = Math.floor(Math.random()*this.collisFreeCells.length);
				x1 = 1+Math.floor(this.collisFreeCells[ind0]/(this.fW-2));
				y1=1+this.collisFreeCells[ind0] %(this.fW-2);
			}
			
			this.collisFreeCells.splice(ind0,1);
			if (this.collisType[i]==1)
			{
				var x2 = this.fW-1-x1;
				var y2 = this.fW-1-y1;
				var ind2 = (y2-1)+(this.fW-2)*(x2-1);
				var pos2 =this.collisFreeCells.indexOf(ind2);
				//console.log("tp "+x1+","+y1+" "+x2+","+y2+" ind: "+ind2+" "+ind0+" p: "+pos2+"... "+this.collisFreeCells);
				if (pos2>=0)
					this.collisFreeCells.splice(pos2,1);
				
			}
			
			this.collis[i] = this.game.add.sprite(x1*this.cellW,y1*this.cellW,'assets',"g"+(this.collisType[i]+1)+'.png');
			if (this.collisType[i] == 0) this.collis[i].anchor.setTo(0.1,0.1);
			if (this.collisType[i] == 1) this.collis[i].anchor.setTo(0.1,0.1);
			if (this.collisType[i] == 2) this.collis[i].anchor.setTo(0.25,-0.05);
			
			this.collis[i].x = this.GetX(x1,y1);
			this.collis[i].y = this.GetY(x1,y1)+10;
			this.collis[i].x1=x1;
			this.collis[i].y1=y1;
			this.collis[i].alpha = 0.5;
			this.collis[i].scale.setTo(0.75);
			if (this.collisType[i] == 2) this.collis[i].scale.setTo(0.85);
			this.collis[i].tp= this.collisType[i];
			this.fieldGroup.add(this.collis[i]);
			this.mCollis = 0;
			this.mFig = -1;
			
			this.rFig = -1;
			this.rCollis = -1;
			
		}
		
		// препятствия, 0 - +1 ход, 1 - портал, 2 - пропуск хода
		
		
		this.WriteOldData();
		
		if (this.randomMode ==1)
			this.SetRandomFig();
		
		
		this.state = 1;
	},
	
	SetFigName: function(rndID)
	{
		if (rndID ==0) this.statusText.text = "Игрок 1(Король)";
		if (rndID ==1) this.statusText.text = "Игрок 1(Носорог)";
		if (rndID ==2) this.statusText.text = "Игрок 1(Бык)";
		for (var j=0;j<3;j++)
				{
					this.units[0][j].inputEnabled = false;
					this.units[0][j].shadow.alpha = 0.8;
				}
					
				this.units[0][rndID].inputEnabled = true;
				this.units[0][rndID].shadow.alpha = 0;
	},
	
	SetRandomFig: function(isNotRnd)
	{
		
			var randomData = [];
				var rndID = 0;
				for (var j=0;j<3;j++)
				if (this.units[0][j].alpha ==1 && this.units[0][j].scale.y ==this.fScale)
				{
					//this.units[0][j].inputEnabled = true;
					randomData.push(j);
				}
				
				if (randomData.length>1)
				rndID = randomData[Math.floor(Math.random()*randomData.length)];
				
				this.SetFigName(rndID);
				this.oldRndID = this.rndID;
		this.rndID = rndID;
		this.units[0][rndID].shadow.alpha = 0;
		
	},
	
	onDragStart: function(e)
	{
		
		if (this.shiftState == 1)
		{
			
		}
		else if (this.state ==1)
		{
			e.tint = 0xFFFFFF;
			
			this.mFig = -1;

			if (this.rCollis ==0) 
			{
				if (this.rFig>=0)
					this.units[0][this.rFig].scale.setTo(this.fScale);
				this.rCollis = -1;
				this.rFig = -1;
			}
			if (this.hintCells.length == 0)
			this.showHintCells(e.x1,e.y1,e.pN,e.figN);
			
			
		}
	},
	
	GetIJPos: function(e)
	{
		var x0 = e.x-30;
		var y0 = e.y+25;
		var minDist =10000;
		var minID = 0;
		var i1=0;
		var j1=0;
		
		for (var k=0;k<this.cells.length;k++)
		{	
			if (Math.sqrt((this.cells[k].x-x0)*(this.cells[k].x-x0)+(this.cells[k].y-y0)*(this.cells[k].y-y0))<minDist)
			{
				minDist  =Math.sqrt((this.cells[k].x-x0)*(this.cells[k].x-x0)+(this.cells[k].y-y0)*(this.cells[k].y-y0));
				minID = k;
			}
		}
		
		i1 = Math.floor(minID/this.fW);
		j1 = minID % this.fW;
		
		return {i:i1,j:j1};
	},
	
	onDragStop: function(e)
	{
		var rP = this.GetIJPos(e);
		var i1 = rP.i;
		var j1 = rP.j;
			
			var isFalse = true;
			if (this.shiftState != 1)
			{
				for (var i=0;i<this.cellsData.length;i++)
				{
					if (this.cellsData[i][0]==i1 && this.cellsData[i][1]==j1)
					{
						this.SetCoord(e,i1,j1,0);
						
						this.DelCells();
						isFalse = false;
						break;
					}
				}
			}
			else
			{
				//console.log("shift "+i1+" "+j1);
				for (var i=0;i<this.hintCells.length;i++)
				{
					if (this.hintCells[i].x1==i1 && this.hintCells[i].y1==j1)
					{
						this.setFigCoord(e.pN,e.figN,i1,j1);
						this.DelCells();
						isFalse = false;
						e.inputEnabled = false;
						this.units[e.pN][e.figN].x1 = i1;
						this.units[e.pN][e.figN].y1 = j1;
						this.units[e.pN][e.figN].x = this.GetX(i1,j1);
						this.units[e.pN][e.figN].y = this.GetY(i1,j1);
						
						break;
					}
				}
			}
			
			console.log(" "+i1+" "+j1+" "+isFalse+" "+e.x1+" "+e.y1);
		
			if (isFalse == true)
			{
				//e.x = this.cellW*e.x1;
				//e.y = this.cellW*e.y1;
				e.x = this.GetX(e.x1,e.y1);
				e.y = this.GetY(e.x1,e.y1);
			}
			else
			{
				if (this.shiftState == 1)
				{
					this.units[0][e.figN].tint = 0xFFFFFF;
					this.nextShiftHint();
				}
				else
				{
					
				}
			}
		
		
	},
	
	SetCoord: function(e,i1,j1,pN)
	{
		
		if (pN==1) 
		{
			var self =this;
			for (var j=0;j<3;j++)
				this.units[0][j].inputEnabled = false;
				
				var isKing = e.figN==0?1:0;
				
				
				
				var x1 = this.GetX(i1,j1);
				var y1 = this.GetY(i1,j1);
				
				
			var t1 = this.game.add.tween(e).to({x:x1,y:y1},500).start();
			t1.onComplete.add(function()
			{
				
								
				self.setFigCoord(e.pN,e.figN,i1,j1);
				
				
				e.x1 = i1;
				e.y1 = j1;
			});
		}
		else
		{
			//e.x = this.cellW*i1;
			//e.y = this.cellW*j1;
			e.x = this.GetX(i1,j1);
			e.y = this.GetY(i1,j1);
			this.setFigCoord(e.pN,e.figN,i1,j1);
			e.x1 = i1;
			e.y1 = j1;
		}
	
		
		
		this.checkFigMove(e.figN,i1,j1,pN);
		
	},
	
	
	
	setFigCoord: function(pN,fN,i1,j1)
	{
//		console.log(pN+" "+fN+" "+i1+" "+j1);
		if (this.shiftState == 0)
		for (var i=0;i<this.collisType.length;i++)
		if (this.collis[i].x1 == i1 && this.collis[i].y1 == j1 && this.collis[i].tp==0)
		{
			this.mCollis = 1+pN;
			this.mFig = fN;
			this.units[pN][fN].tint = 0xFF00FF;
			break;
		
		}
		
		for (var i=0;i<this.collisType.length;i++)
		if (this.collis[i].x1 == i1 && this.collis[i].y1 == j1 && this.collis[i].tp==1)
		{
			
			//this.units[pN][fN].tint = 0xFF00FF;
			this.setPortal(i1,j1,pN,fN);
			break;
		}
		
		for (var i=0;i<this.collisType.length;i++)
		if (this.collis[i].x1 == i1 && this.collis[i].y1 == j1 && this.collis[i].tp==2){
			this.rCollis = pN;
			this.rFig = fN;
			this.units[pN][fN].scale.setTo(this.fScale,0.7*this.fScale);
			break;
		}
		
	},
	
	setPortal: function(i1,j1,pN,fN)
	{
		
		var self = this;
		var i2=this.fW-1-i1;
		var j2=this.fW-1-i2;
	
		var isFree = false;
		var calcIter = 0;
		
		if (this.isCellFree(i2,j2)== false)
		for (var k=0;k<8;k++)
		{	
			if (k<4)
			{
				if (this.isCellFree(Math.floor(k/3)-1+i2,j2-1+k%3)==true)
				{
					i2 =Math.floor(k/3)-1+i2;
					j2 = k%3 - 1+j2;
					break;
				}
			}
			else
			{
				if (this.isCellFree(Math.floor((k+1)/3)+i2-1,j2-1+(k+1)%3)==true)
				{
					i2 =Math.floor((k+1)/3)-1+i2;
					j2 = (k+1)%3 - 1+j2;
					break;
				}
			}
		}
		
		this.units[pN][fN].x1 = i2;
		this.units[pN][fN].y1 = j2;
		
		//this.units[pN][fN].x = this.units[pN][fN].x1*this.cellW;
		//this.units[pN][fN].y = this.units[pN][fN].y1*this.cellW;
		this.units[pN][fN].x = this.GetX(this.units[pN][fN].x1,this.units[pN][fN].y1);
		this.units[pN][fN].y = this.GetY(this.units[pN][fN].x1,this.units[pN][fN].y1);
		
		
		//console.log("portal "+i2+","+j2+"  "+pN+" "+fN);
		this.setFigCoord(pN,fN,i2,j2);
		
	},
	
	
	FillCellsToMove: function(fN,i1,j1,x1,y1,figCoord)
	{
		var cellsToMove = [];
		
		function isCellFree(i1,j1)
		{
		
			for (var i=0;i<2;i++)
			for (var j=0;j<3;j++)
			{
				
				//if (this.units[i][j].x1==i1 && this.units[i][j].y1==j1)
				if (figCoord[i][j][0]==i1 && figCoord[i][j][1]==j1)
				{
					return false;
				}
			}
			
			return true;
		}
		
		
		if (Math.abs(i1-x1)<2 && Math.abs(j1-y1)<2 )
			{
				dirX = i1-x1;
				dirY = j1-y1;
				if (fN==0)
				{
					//console.log("Mode "+fN+" "+this.kingNoPushMode);
					var isNoPush = this.kingNoPushMode;
					if (isNoPush ==0 || (isNoPush==1 &&(x1==0 && y1==this.fW-1)||(y1==0 && x1==this.fW-1)))
					{
					if (dirX !=0 && dirY ==0)
					{	
						var shiftX = [2,2,2,0,0];
						var shiftY = [0,-2,2,-2,2];
						for (var i=0;i<5;i++)
							if (isCellFree(x1-dirX*shiftX[i],y1+shiftY[i])==true)
								cellsToMove.push({x:x1-dirX*shiftX[i],y:y1+shiftY[i]});
					}
					else if (dirX ==0 && dirY != 0)
					{	
						var shiftX = [-2,-2,0,2,2];
						var shiftY = [0,2,2,2,0];
						for (var i=0;i<5;i++)
							if (isCellFree(x1+shiftX[i],y1-dirY*shiftY[i])==true)
								cellsToMove.push({x:x1+shiftX[i],y:y1-dirY*shiftY[i]});
					}
					else if (dirX !=0 && dirY !=0)
					{
						var shiftX = [2,2,0];
						var shiftY = [0,2,2];
						for (var i=0;i<3;i++)
							if (isCellFree(x1-dirX*shiftX[i],y1-dirY*shiftY[i])==true)
								cellsToMove.push({x:x1-dirX*shiftX[i],y:y1-dirY*shiftY[i]});
					}
					}
					
				}
				else if (fN==1)
				{
					if (dirX !=0 && dirY ==0)
					{	
						if (isCellFree(x1-dirX,y1)==true)
								cellsToMove.push({x:x1-dirX,y:y1});
					}
					else if (dirX ==0 && dirY != 0)
					{	
						if (isCellFree(x1,y1-dirY)==true)
								cellsToMove.push({x:x1,y:y1-dirY});
					}
					else if (dirX !=0 && dirY !=0)
					{
						var shiftX = [1,0];
						var shiftY = [0,1];
						for (var i=0;i<2;i++)
							if (isCellFree(x1-dirX*shiftX[i],y1-dirY*shiftY[i])==true)
								cellsToMove.push({x:x1-dirX*shiftX[i],y:y1-dirY*shiftY[i]});
					}
				}
				else if (fN==2)
				{
					if (dirX !=0 && dirY ==0)
					{	
						if (isCellFree(x1-dirX,y1-1)==true)
								cellsToMove.push({x:x1-dirX,y:y1-1});
						if (isCellFree(x1-dirX,y1+1)==true)
								cellsToMove.push({x:x1-dirX,y:y1+1});
					}
					else if (dirX ==0 && dirY != 0)
					{	
						if (isCellFree(x1-1,y1-dirY)==true)
								cellsToMove.push({x:x1-1,y:y1-dirY});
						if (isCellFree(x1+1,y1-dirY)==true)
								cellsToMove.push({x:x1+1,y:y1-dirY});		
					}
					else if (dirX !=0 && dirY !=0)
					{
						var shiftX = [1,1,-1];
						var shiftY = [1,-1,1];
						for (var i=0;i<3;i++)
							if (isCellFree(x1-dirX*shiftX[i],y1-dirY*shiftY[i])==true)
								cellsToMove.push({x:x1-dirX*shiftX[i],y:y1-dirY*shiftY[i]});
					}
				}
			
			}
			
		return cellsToMove;
	},
	
	checkFigMove: function(fN,i1,j1,pN)
	{
		var isFound = 0;
		
		
		for (var k=0;k<3;k++)
		{
			var x1= this.units[1-pN][k].x1;
			var y1= this.units[1-pN][k].y1;
			
			var tmpFig = [[[],[],[]],[[],[],[]]];
			
			for (var i2=0;i2<2;i2++)
			for (var j2=0;j2<3;j2++)
			{
				tmpFig[i2][j2][0] = this.units[i2][j2].x1;
				tmpFig[i2][j2][1] = this.units[i2][j2].y1;
				tmpFig[i2][j2][2] = this.units[i2][j2].alpha;
			}		
			
			
			var cellsToMove = this.FillCellsToMove(fN,i1,j1,x1,y1,tmpFig);
			
				if (cellsToMove.length>0) 
				{
					isFound = 1;
					this.statusText.text = "Игрок "+((1-pN)+1)+", сдвиг";
					this.shiftFig(1-pN,k,cellsToMove,fN);
				}
			
			
		}
		
		
		if (pN==0)
		{
			
			if (isFound > 0)
			{
				this.oldKingPushed[0] = this.kingWasPushed[0];
				this.kingWasPushed[0]=0;
				this.game.time.events.add(1000,this.NextTurn,this);
			}
			else
			{
				this.oldKingPushed[0] = this.kingWasPushed[0];
				this.kingWasPushed[0]=0;
				this.NextTurn();
			}
		}
		
	},
	
	addShiftHint: function(cells,fN)
	{
		this.currentShift = 0;
		this.shiftHints[this.shiftCount] = cells;
		this.shiftFigs[this.shiftCount] = fN;
		this.shiftCount++;
		//alert("add "+this.shiftCount+" "+fN+" "+cells.length);
		
	},
	
	startShiftHint: function()
	{
		
		this.showShiftHint(this.shiftHints[0],this.shiftFigs[0]);
	
	},
	
	nextShiftHint: function()
	{
		this.currentShift++;
		if (this.currentShift>=this.shiftCount)
		{
			this.NextTurn();
		}
		else
		{
			this.showShiftHint(this.shiftHints[this.currentShift],this.shiftFigs[this.currentShift]);
		}
	
	},
	
	DistKingToEnd: function(pN,kX,kY)
	{
		//var kX = this.units[pN][0].x1;
		//var kY = this.units[pN][0].y1;
		var eX = this.fW-1;
		var eY = 0;
		if (pN==1)
		{
			eX = 0;
			eY = this.fW-1;
		}
		
		return Math.round(Math.sqrt((kX-eX)*(kX-eX)+(kY-eY)*(kY-eY)));
	},
	
	shiftFig: function(pN,fN,cells0,pushFN)
	{
		
		var hintsCount = 0;
		//alert(pN+" "+fN+" "+pushFN);
		if (fN==0)
		{
			this.oldKingPushed[pN] = this.kingWasPushed[pN];
			this.kingWasPushed[pN] = pushFN;
		}
		
		if (this.units[pN][fN].alpha == 1 && this.units[pN][fN].scale.y==this.fScale)
		{
			
			var cells = [];
			var isOut = 0;
			for (var i=0;i<cells0.length;i++)
			{
				if (cells0[i].x>=0 && cells0[i].x<this.fW && cells0[i].y>=0 && cells0[i].y<this.fW)
				cells.push(cells0[i]);
			}
			
			if (cells.length==0 && fN>0) 
			{
				cells = cells0;
				isOut = 1;
			}
			
			if (cells.length>0)
			{
				if (pN==0 && isOut==0 && cells.length>0) 
				{
					var self = this;
					hintsCount++;
					this.game.time.events.add(600,function()
					{
						self.addShiftHint(cells,fN);
					},this);	
					
				}
				else
				{
					
					var n = Math.floor(Math.random()*cells.length);
					if (fN==0 && cells.length>1)
					{
						var minDist=1000;
						var minID = 0;
						for (var k=0;k<cells.length;k++)
						{
							var dist0 = this.DistKingToEnd(1,cells[k].x,cells[k].y);
							var collCell = this.GetCollisState(cells[k].x,cells[k].y);
							if (dist0<minDist && collCell.S==0 && collCell.T==0)
							{
								minID = k;
								minDist = dist0;
							}
						}
						
						n=minID;
					}
					
					if (fN>0 && cells.length>1)
					{
						var minDist=1000;
						var minID = 0;
						for (var k=0;k<cells.length;k++)
						{
							var dist0 = this.DistKingToEnd(0,cells[k].x,cells[k].y);
							var collCell = this.GetCollisState(cells[k].x,cells[k].y);
							if (dist0<minDist && collCell.S==0 && collCell.T==0)
							{
								minID = k;
								minDist = dist0;
							}
						}
						
						n=minID;
					}
					
					
					var x1 = cells[n].x;
					var y1 = cells[n].y;
					
					this.units[pN][fN].x1 = x1;
					this.units[pN][fN].y1 = y1;
					
					
					var self = this;
					
				var x00 = this.GetX(x1,y1);
				var y00 = this.GetY(x1,y1);
				
					var t1 = this.game.add.tween(this.units[pN][fN]).to({x:x00,y:y00},500).start();
					t1.onComplete.add(function(e)
					{
						self.setFigCoord(e.pN,e.figN,e.x1,e.y1);
					});
				
					if (this.units[pN][fN].x1<0 || this.units[pN][fN].x1>this.fW-1 || this.units[pN][fN].y1<0 || this.units[pN][fN].y1>this.fW-1) this.units[pN][fN].alpha = 0.5;
				}
			}
		}
		
		if (pN==0 && hintsCount>0)
		{
			var self = this;
			this.game.time.events.add(600,function()
			{
				self.startShiftHint();
			},this);
		
		}
		
		if (pN==1)
			for (var j=0;j<3;j++)
				this.units[0][j].inputEnabled = false;
		
	},
	
	isCellFree: function(i1,j1)
	{
	
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			if (this.units[i][j].x1==i1 && this.units[i][j].y1==j1)
			{
				return false;
			}
		}
		
		return true;
	},
	
	WriteOldData: function()
	{
		
		if (this.oldFigCoord[0][0].length>0)
		{
			for (var i=0;i<2;i++)
			for (var j=0;j<3;j++)
			{
				for (var k=0;k<5;k++)
					this.oldFigCoord1[i][j][k] = this.oldFigCoord[i][j][k];
				
			}
			this.btnBack.tint = 0xFFFFFF;
		}
		
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			this.oldFigCoord[i][j][0] = this.units[i][j].x1;
			this.oldFigCoord[i][j][1] = this.units[i][j].y1;
			this.oldFigCoord[i][j][2] = this.units[i][j].alpha;
			this.oldFigCoord[i][j][3] = this.units[i][j].scale.y;
			this.oldFigCoord[i][j][4] = this.units[i][j].tint;
		}
		
		//console.log("K: "+this.kingWasPushed);
		//console.log("O: "+this.oldKingPushed);
		
		
		
	},
	
	NextTurn: function()
	{
		this.shiftState = 0;
		this.shiftCount = 0;
		this.shiftHints = [];
		this.shiftFigs = [];

		if (this.units[0][0].x1 == this.fW-1 && this.units[0][0].y1 == 0)
		{
			this.statusText.text = "Игрок 1 выиграл!";
			this.statusText.visible = true;
			this.statusBack.visible = false;
			this.state = 0;
		}
		if (this.units[1][0].x1 == 0 && this.units[1][0].y1 == this.fW-1)
		{
			this.statusText.text = "Игрок 2 выиграл!";
			this.statusText.visible = true;
			this.statusBack.visible = false;
			this.statusText.visible = true;
			this.state = 0;
		}
		
		if (this.state>0)
		{
			this.movePlayer = 0;	
			
			if (this.mCollis>0)
			{
				this.movePlayer = this.mCollis;
				this.mCollis = 0;
				
			}
			else
			{
		
				if (this.state == 1)
				{ 
					this.state = 2;
				}
				else if (this.state == 2)
				{
					this.state = 1;
				}
			}
			
			this.statusText.text = "Игрок "+this.state;
			
			
			if (this.state == 1)
			{
				this.SetX1Y1();
			
				if (this.randomMode==1)
				if (this.mFig==-1)
				{
					this.SetRandomFig();
								
					for (var j=0;j<3;j++)
					this.units[0][j].inputEnabled = false;
					this.units[0][this.rndID].inputEnabled = true;
				}
				
				this.turnsCount++;
				this.infoText.text = "Turns: "+this.turnsCount+" Time: "+this.timeSinceStart;
				this.WriteOldData();
				
				for (var j=0;j<3;j++)
				if (this.units[0][j].alpha ==1)
				{
					if (this.mFig>-1)
					{
						if (this.mFig==j)
							this.units[0][j].inputEnabled = true;
						else	
							this.units[0][j].inputEnabled = false;
					}
					else
					{	if (this.randomMode!=1)
							this.units[0][j].inputEnabled = true;
						
					}
					
					if (this.units[0][j].scale.y<this.fScale)
					{
						this.units[0][j].inputEnabled = false;
						
					}
				}
				
				
			}
			else if (this.state == 2)
			{
				for (var j=0;j<3;j++)
					this.units[0][j].inputEnabled = false;
					
				this.AITurn();	
			}
		}
		else
		{
			for (var j=0;j<3;j++)
					this.units[0][j].inputEnabled = false;
		}
	},
	
	SetX1Y1: function()
	{
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			//var i1 = Math.floor(this.units[i][j].x/this.cellW);
			//var j1 = Math.floor(this.units[i][j].y/this.cellW);
			var r = this.GetIJPos(this.units[i][j]);
			var i1 = r.i;
			var j1 = r.j;
			
			this.units[i][j].x1 = i1;
			this.units[i][j].y1 = j1;
		}
	
	},
	
	AICheck:function(figEnabled)
	{
		
	
	},
	
	GetCollisState: function(i1,j1)
	{
		var isAddTurn = 0;
		var isTeleport =0;
		var isStack = 0;
		if (this.collis.length>0)
					for (var l=0;l<this.collis.length;l++)
					{
						if (this.collis[l].x1 == i1 && this.collis[l].y1 == j1)
						{
							if (this.collis[l].tp==0) isAddTurn = 1;
							if (this.collis[l].tp==1)
							{
								isTeleport = 1;
								
							}
							
							if (this.collis[l].tp==2) isStack = 1;
						}
					}
					
		return {A:isAddTurn,T:isTeleport,S:isStack};
	},
	
	AITurn: function()
	{
		var figEnabled = [];
		var fN=-1;
			
		
			
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			this.figData[i][j][0] = this.units[i][j].x1;
			this.figData[i][j][1] = this.units[i][j].y1;
			this.figData[i][j][2] = this.units[i][j].alpha;
		}		
		
		this.SetX1Y1();
		var kX = this.units[0][0].x1;
		var kY = this.units[0][0].y1;
		var k1X = this.units[1][0].x1;
		var k1Y = this.units[1][0].y1;
		
		var kingEnemyDist = Math.round(Math.sqrt((this.fW-1-kX)*(this.fW-1-kX)+kY*kY));
		var kingDist =  Math.round(Math.sqrt(k1X*k1X)+(this.fW-1-k1Y)*(this.fW-1-k1Y));
		
		var distToEnemyKing = [0,0,0];
		for (var i=0;i<3;i++)
		{
			distToEnemyKing[i] = Math.round(Math.sqrt((this.units[1][i].x1-kX)*(this.units[1][i].x1-kX)+(this.units[1][i].y1-kY)*(this.units[1][i].y1-kY)));
		}
		
		var distEnemyKingToEnd = this.DistKingToEnd(0,this.units[0][0].x1,this.units[0][0].y1);
		
		var endX=-1;
		var endY=-1;
		
		
		if (this.randomMode==0)
		{
			fN=-1;
			var arr = [];
			
			for (var i=1;i<3;i++)
				{
				var distFigToEnd = this.DistKingToEnd(0,this.units[1][i].x1,this.units[1][i].y1);
				
				var minID = -1;
				
				var i1 = this.units[1][i].x1;
				var j1 = this.units[1][i].y1;	
				this.cellsData = this.GetCellsData(i1,j1,1,i);
				
				if (distFigToEnd<distEnemyKingToEnd)
				for (var k=0;k<this.cellsData.length;k++)
				{
					var i1 = this.cellsData[k][0];
					var j1 = this.cellsData[k][1];
					
					dist = Math.sqrt((i1-kX)*(i1-kX)+(j1-kY)*(j1-kY));
					
					if (dist<2 && ((i1>=kX && j1<kY) || (kX==this.fW-1 && i1-kX<1 && j1-kY==-1 )))
					{
						minID = k;
						endX = i1;
						endY = j1;
						var a1= [i,i1,j1];
						
						arr.push(a1);
					}
				
				}
				
			}
			
			if (arr.length>0) 
			{
				var ind = 0;
				if (arr.length>1) 
				{
					var isGoodTurn = 0;
					for (var m=0;m<arr.length;m++)
					{
						if (arr[m][1]-kX==1 && arr[m][2]-kY==-1)
						{
							ind = m;
							break;
							isGoodTurn = 1;
						}
					}	
					
					if (isGoodTurn ==0)
					ind = Math.floor(Math.random()*arr.length);
				
				
				}
				endX = arr[ind][1];
				endY = arr[ind][2];
				fN = arr[ind][0];
				
			}	
			
			var isFree = 0;
			if (this.units[1][0].x1<2 && this.units[1][0].y1>this.fW-3)
			{
				isFree = 1;
				for (var ii=0;ii<3;ii++) 
				if (this.units[0][ii].x1 == 0 && this.units[0][ii].y1==this.fW-1)
				{
					isFree = 0;
					break;
				}
			}
			
			if (isFree == 1) fN = 0;
			
			
			if (fN<0)
			{
				
				for (var i=0;i<3;i++)
				{
					var endIter = 12-kingEnemyDist;
					if (i>0 && distToEnemyKing[i]<3 && kingEnemyDist<4) endIter+=(4-distToEnemyKing[i]);
					if (i==0) endIter = 18;
					if (i==0 && kingDist<3) endIter+=(4-kingDist)*4;
					
					
					for (var j=0;j<endIter;j++)
						if (this.units[1][i].alpha ==1 && this.units[1][i].scale.y==this.fScale ) figEnabled.push(i);
				}
				fN = figEnabled[Math.floor(Math.random()*figEnabled.length)];
				
			}
		}
		else
		{
			for (var i=0;i<3;i++)
			{
				if (this.units[1][i].alpha ==1 && this.units[1][i].scale.y==this.fScale ) figEnabled.push(i);
			}
			fN = figEnabled[Math.floor(Math.random()*figEnabled.length)];
		}
	
		
		if (this.movePlayer == 2) 
		{
			fN = this.mFig;
			this.mFig = -1;
			this.units[1][fN].tint = 0xFFFFFF;
		}
		
		//console.log("FN "+fN);
		
		//if (figEnabled.length>0)
		if (fN>=0)
		{
			var i1 = this.units[1][fN].x1;
			var j1 = this.units[1][fN].y1;
			
			
			this.cellsData = this.GetCellsData(i1,j1,1,fN);
			
			var cellID = Math.floor(Math.random()*this.cellsData.length);
			
			if (cellID >=this.cellsData.length) cellID=this.cellsData.length-1;
			
			var minDist = 10000;
			var minID = 0;
			var dist;
		
			
			if (fN==0 && Math.random()>0)
			{
				for (var k=0;k<this.cellsData.length;k++)
				{
					var i1 = this.cellsData[k][0];
					var j1 = this.cellsData[k][1];
					var i2 = this.units[1][fN].x1;
					var j2 = this.units[1][fN].y1;
					
					var isAddTurn = 0;
					var isTeleport = 0;
					var isStack = 0;
					
					if (this.collis.length>0)
					for (var l=0;l<this.collis.length;l++)
					{
						if (this.collis[l].x1 == i1 && this.collis[l].y1 == j1)
						{
							if (this.collis[l].tp==0) isAddTurn = 1;
							if (this.collis[l].tp==1)
							{
								if (i1>this.fW/2 && j<this.fW/2)
									isTeleport = 1;
								if (i1<this.fW/2 || j>this.fW/2)
									isTeleport = -1;	
							}
							
							if (this.collis[l].tp==2) isStack = 1;
						}
					}
					
					//console.log("K "+i1+" "+j1+" "+isAddTurn+" "+isTeleport+" "+isStack);
					
					dist = Math.sqrt(i1*i1+(this.fW-j1)*(this.fW-j1));
					if (dist<minDist && isStack==0 && isTeleport>=0)
					{
						minDist = dist;
						minID = k;
					}
					
					if (i1 < i2+1 && j1+1 > j2 && isAddTurn==1)
					{
						minID = k;
						break;
					}
				}
				
				cellID = minID;
			}
			else
			{
				var minDist=10000;
					var distFigToEnd = this.DistKingToEnd(0,this.units[1][fN].x1,this.units[1][fN].y1);
				
					if (distFigToEnd<distEnemyKingToEnd)
					for (var k=0;k<this.cellsData.length;k++)
					{
						var i1 = this.cellsData[k][0];
						var j1 = this.cellsData[k][1];
						var isAddTurn = 0;
						var isTeleport = 0;
						var isStack = 0;
						
						if (this.collis.length>0)
							for (var l=0;l<this.collis.length;l++)
							if (this.collis[l].x1 == i1 && this.collis[l].y1 == j1)
							{
								if 	(this.collis[l].tp ==0) isAddTurn = 1;
								if 	(this.collis[l].tp ==1) isTeleport = 1;
								if 	(this.collis[l].tp ==2) isStack = 1;
							}
						
						dist = Math.sqrt((i1-kX)*(i1-kX)+(j1-kY)*(j1-kY));
						//console.log("k "+k+" "+dist+" "+minDist+" ");
						if (dist<minDist && isTeleport ==0 && isStack == 0)
						{
							minDist = dist;
							minID = k;
						}
						
						if (dist<2 && i1>=kX && j1<kY)
						{
							minID = k;
							break;
						}
						
						if (isAddTurn ==1 &&  Math.random()>0.6)
						{
							minID = k;
							break;
						}
					
					}
					else
					for (var k=0;k<this.cellsData.length;k++)
					{
						var i1 = this.cellsData[k][0];
						var j1 = this.cellsData[k][1];
						dist = Math.sqrt((i1-this.fW+1)*(i1-this.fW+1)+j1*j1);
						//console.log("k "+k+" "+dist+" "+minDist+" ");
						if (dist<minDist)
						{
							minDist = dist;
							minID = k;
						}
					
					}	
				
					cellID = minID;
				
			}
			
			
			i1 = this.cellsData[cellID][0];
			j1 = this.cellsData[cellID][1];
			
			if (endX>0)
			{
				i1 = endX;
				j1 = endY;
				//console.log("f "+fN+" "+endX+" "+endY);
			}
						
			var figOb = this.units[1][fN];
			this.SetCoord(figOb,i1,j1,1);
			//console.log("F "+fN+" "+i1+" "+j1);
			this.cellsData = [];
		}
		
		for (var j=0;j<3;j++)
		{
			this.units[0][j].inputEnabled = false;
			this.units[1][j].scale.setTo(this.fScale);
		}
		
		if (this.rCollis ==1) this.rCollis = -1;
		
		var self = this;
		this.game.time.events.add(600,function()
		{
			
			self.oldKingPushed[1] = self.kingWasPushed[1];
			self.kingWasPushed[1]=0;
			if (self.shiftState != 1)
			{
				self.NextTurn();
				
			}
		});
	
	},
	
	onCellClick: function(e)
	{
	
	
	},
	
	
	showShiftHint: function(cellsData,fN)
	{
		
		this.DelCells();
		
		this.units[0][fN].tint = 0x88FFBB;
		this.statusText.text = "Игрок 1, сдвиг";
		
		for (var i=0;i<3;i++)
			this.units[0][i].inputEnabled = false;
	
		for (var i=0;i<cellsData.length;i++)
		{
		
			var x1 = cellsData[i].x;
			var y1 = cellsData[i].y;
			/*
			this.hintCells[i] = this.game.add.sprite(x1*this.cellW,y1*this.cellW,'assets','pad.png');
			*/
			this.hintCells[i] =this.createPad(x1,y1);
			this.hintCells[i].x1 = x1;
			this.hintCells[i].y1 = y1;
			this.hintCells[i].tint = 0x0000FF;
			this.units[0][fN].inputEnabled = true;
			this.shiftState = 1;
			this.padGroup.add(this.hintCells[i]);
		}
	},
	
	createPad: function(i,j)
	{
		var cW = 195/2;
			var cH = 100/2;
			
			var cN = this.shopSet+"";
			if (this.shopSet == 0)  cN="";
			
			var cName = "cell"+cN+"1.png";
			if ((i+j) % 2 ==0) cName = "cell"+cN+"2.png";
			var cell =  this.game.add.sprite(0,0,'assets',cName);
			cell.scale.setTo(0.5);
			
			cell.x =cW/2+ i*cW/2-j*cW/2;
			cell.y =i*cH/2+j*cH/2;
			return cell;
	},
	
	showHintCells: function(i1,j1,pN,fN)
	{
		this.cellsData = this.GetCellsData(i1,j1,pN,fN);
		this.hintCells = [];
		
		
		for (var i=0;i<this.cellsData.length;i++)
		{
			var x1 = this.cellsData[i][0];
			var y1 = this.cellsData[i][1];
			
//this.hintCells[i]=this.game.add.sprite(x1*this.cellW,y1*this.cellW,'assets','pad.png');
			
			this.hintCells[i]=this.createPad(x1,y1);
			this.hintCells[i].tint = 0xFF00FF;
			this.padGroup.add(this.hintCells[i]);
			this.hintCells[i].i = i;
			
		}
	
	},
	
	GetCellsData: function(i1,j1,pN,fN)
	{
		
		var cellsArray = [];
	
		if (fN==0)
		{	
			if (this.kingWasPushed[pN] ==0)
			for (var i=0;i<9;i++)
			{
				var ii = i1+~~(i/3)-1;
				var jj = j1+(i%3)-1;
				if (i!=4) cellsArray.push([ii,jj]);
			}
			
			if (this.kingWasPushed[pN] ==1)
			{
				cellsArray.push([i1-1,j1-1]);
				cellsArray.push([i1-1,j1+1]);
				cellsArray.push([i1+1,j1-1]);
				cellsArray.push([i1+1,j1+1]);
			}	
			if (this.kingWasPushed[pN] ==2)
			{
				cellsArray.push([i1,j1-1]);
				cellsArray.push([i1,j1+1]);
				cellsArray.push([i1-1,j1]);
				cellsArray.push([i1+1,j1]);
			}
		}	
			
		if (fN==1)
		{
			cellsArray.push([i1-1,j1-1]);
			cellsArray.push([i1-1,j1+1]);
			cellsArray.push([i1+1,j1-1]);
			cellsArray.push([i1+1,j1+1]);
			//cellsArray.push([i1-2,j1-2]);
			//cellsArray.push([i1-2,j1+2]);
			//cellsArray.push([i1+2,j1-2]);
			//cellsArray.push([i1+2,j1+2]);
		}		
		if (fN==2)
		{
			cellsArray.push([i1,j1-1]);
			cellsArray.push([i1,j1+1]);
			cellsArray.push([i1-1,j1]);
			cellsArray.push([i1+1,j1]);
			//cellsArray.push([i1,j1-2]);
			//cellsArray.push([i1,j1+2]);
			//cellsArray.push([i1-2,j1]);
			//cellsArray.push([i1+2,j1]);
		}
		
		var cellsData = [];
		for (var i=0;i<cellsArray.length;i++)
		{
			if (this.checkCell(cellsArray[i][0],cellsArray[i][1],pN,fN)==true)
			{
				cellsData.push([cellsArray[i][0],cellsArray[i][1]]);
			}
		}
		
		return cellsData;
	},
	
	DelCells:function()
	{
		for (var i=0;i<this.hintCells.length;i++)
		{
			this.hintCells[i].destroy();
		}
		
		this.hintCells = [];
		this.cellsData = [];
	
		
	},
	
	
	
	checkCell: function(i1,j1,playerN,figN)
	{
		if (i1<0 || i1>=this.fW || j1<0 || j1>=this.fW) return false;
		
		for (var i=0;i<2;i++)
		for (var j=0;j<3;j++)
		{
			var x1 = this.units[i][j].x1;
			var y1 = this.units[i][j].y1;
			if (x1==i1 && y1==j1) return false;	
		}	
		
		return true;
		
	},
	
	makeTurn: function(playerN,figN,i1,j1)
	{
		
	
	},
	
	makeReact: function(playerN,figN)
	{
	
	},
 
  reset: function () {
    this.timeSinceLastAction = new Date().getTime();
	
  },

};



App.game = new Phaser.Game(1024,768, Phaser.CANVAS, '');

console.log(App.game);


App.game.state.add('Preloader', App.Preloader);
App.game.state.add('Game', App.Game);
App.game.state.start('Preloader');