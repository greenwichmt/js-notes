/**
 * @author Dodd
 */
var board=new Array();
var hasConflicted=new Array();
var score=0;

var startX=0;
var startY=0;
var endX=0;
var endY=0;



$(document).ready(function(){
	forMobile();
	newGame();
})

function forMobile(){
	if (documentWidth>500) {
		grid_ContainerWidth=500;
		cellSideLength=100;
		cellSpace=20;

	};



	$("#grid_Container").css('width',grid_ContainerWidth-2*cellSpace);
	$("#grid_Container").css('height',grid_ContainerWidth-2*cellSpace);
	$('#grid_Container').css('padding',cellSpace);
	$('#grid_Container').css('border-radius',0.02*grid_ContainerWidth);

	$('.cell').css('width',cellSideLength);
	$('.cell').css('height',cellSideLength);
	$('.cell').css('border-radius',0.1*cellSideLength);
	$('.top').css('width',grid_ContainerWidth);
	$('#newGame_btn').css('padding',0.13*cellSideLength+'px'+' 0px')
}

function newGame(){
	init();//初始化棋盘
	//生成两个数字
	generateOneNumber();
	generateOneNumber();
	score=0;
	updateScore(score);
}



function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4;j++) {
			var gridCell=$("#grid_cell_"+i+"_"+j);
			gridCell.css('top',getTop(i,j));
			gridCell.css('left',getLeft(i,j));
		}
			
	}
	



	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
			for (var j= 0; j < 4;j++) {
				board[i][j]=0;
				hasConflicted[i][j]=false;
			};	
	}

	updateBoardView();	
	score=0;
}


function updateBoardView(){
	$(".number_cell").remove();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j <4; j++) {
			$("#grid_Container").append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
			//alert(document.getElementById('grid_Container').nodeType);
			var theNumberCell=$('#number_cell_'+i+'_'+j+'');

			if (board[i][j]==0) {

				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('left', getLeft(i,j)+cellSideLength/2);
				theNumberCell.css('top', getTop(i,j)+cellSideLength/2);
			}
			else{
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top',getTop(i,j));
				theNumberCell.css('left',getLeft(i,j));
				theNumberCell.css('color', getNumberColol(board[i][j]));
				theNumberCell.css('background-color',getBackgroundColor(board[i][j]));
				theNumberCell.text(board[i][j])
			}

		hasConflicted[i][j]=false;
		};
	};
	$('.number_cell').css('line-height',cellSideLength+'px')
	$('.number_cell').css('font-size',0.6*cellSideLength+'px')
	$('.number_cell').css('border-radius',0.1*cellSideLength);
	
}

function generateOneNumber() {
	if (nospace(board)) {
		return false;
	} 

	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	//取随机位置

	var times=0;
	while(times<50){
		if(board[randx][randy]==0){
			break;
		}
		var randx=parseInt(Math.floor(Math.random()*4));
		var randy=parseInt(Math.floor(Math.random()*4));

		times++;
	}
		if (times==50) {
			for(var i=0;i<4;i++){
				for(var j=0;j<4;j++){
					if (board[i][j]==0) {
						randx=i;
						randy=j;
					};
				}
			}

		};

	var randomNum= parseInt(Math.floor(Math.random()*4)) +1;
		if (randomNum==3) {
			randomNum=4
		}
		else if (randomNum==1) {
			randomNum=2;
		};


	board[randx][randy]=randomNum;
	
	showNumberAnimate(randx,randy,randomNum);


	return true;
	
}

$(document).keydown(function(event){
 switch(event.keyCode)
 {
  case (37):if(moveLeft()){
				setTimeout('generateOneNumber()',130);
				
			}
			else{
				setTimeout('isGameOver()',170);
			};//left
			break;
	case 38:if(moveUp()){
				setTimeout('generateOneNumber()',130);
				// generateOneNumber();
				event.preventDefault();
			}
			else{
				setTimeout('isGameOver()',170);
			};   //up
			break;
	case 39:if(moveRight()){
				setTimeout('generateOneNumber()',130);
				
			}
			else{
				setTimeout('isGameOver()',170);
			};  //right
			break;
	case 40:if(moveDown()){
				setTimeout('generateOneNumber()',130);
				event.preventDefault();
			}
			else{
				setTimeout('isGameOver()',170);
			}; //down
			break;
		default:
			break;
	}
})


document.addEventListener('touchstart',function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;

});
document.addEventListener('touchend',function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;


	var moveX=endX - startX;
	var moveY=endY - startY;

	if (Math.abs(moveX)<0.13*documentWidth&&Math.abs(moveY)<0.13*documentWidth) {

		return;
	};

	if(Math.abs(moveX)>=Math.abs(moveY)){
		//x
		if(moveX>0){
			//move right
			if(moveRight()){
				setTimeout('generateOneNumber()',130);
				
			}
			else{
				setTimeout('isGameOver()',170);
			};

		}
		else{
			//move left
			if(moveLeft()){
				setTimeout('generateOneNumber()',130);
				
			}
			else{
				setTimeout('isGameOver()',170);
			};

		}

	}
	else{
		//y
		if(moveY>0){
			//move down
			event.preventDefault();
			if(moveDown()){
				setTimeout('generateOneNumber()',130);
				event.preventDefault();
			}
			else{
				setTimeout('isGameOver()',170);
			};

		}
		else{
			//move up
			event.preventDefault();
			if(moveUp()){
				setTimeout('generateOneNumber()',130);
				// generateOneNumber();
				event.preventDefault();
			}
			else{
				setTimeout('isGameOver()',170);
			};

		}


	}
});






function isGameOver(){
	if (nospace(board)&&noMove(board)) {
		gameOver();
	};
};

function gameOver(){
	alert('GameOver!');
}



function moveLeft(){

	if (!canMoveLeft(board)) {
		return false;
	};

	
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(!board[i][j]==0){
					for(var k=0;k<j;k++){
						if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
							showMoveAnimate(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;

							//move
							continue;
						}
						else if (board[i][j]==board[i][k]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
							showMoveAnimate(i,j,i,k);
							//move	

							board[i][k]=board[i][j]+board[i][k];
							board[i][j]=0;
							//add

							//add score
							score+=board[i][k];
							updateScore(score);
							hasConflicted[i][k]=true;
							continue;
						}
					}
				}
			}
		}

	
	setTimeout('updateBoardView()',122);
	return true;

}


function moveRight(){
	if (!canMoveRight(board)) {
		return false;
	};

	for(var i=0;i<4;i++){
			for(var j=3;j>-1;j--){
				if(!board[i][j]==0){
					for(var k=3;k>j;k--){
						if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
							showMoveAnimate(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;

							//move
							continue;
						}
						else if (board[i][j]==board[i][k]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
							showMoveAnimate(i,j,i,k);
							//move	

							board[i][k]=board[i][j]+board[i][k];
							board[i][j]=0;
							//add
							hasConflicted[i][k]=true;//碰撞条件
							score+=board[i][k]
							updateScore(score);
							continue;
						}
					}
				}
			}
		}

	
	setTimeout('updateBoardView()',122);
	return true;

}


function moveUp(){

	if (!canMoveUp(board)) {
		return false;
	};

	
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(!board[i][j]==0){
					for(var k=0;k<i;k++){
						if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
							showMoveAnimate(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;

							//move
							continue;
						}
						else if (board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
							showMoveAnimate(i,j,k,j);
							//move	

							board[k][j]=board[i][j]+board[k][j];
							board[i][j]=0;
							//add
							score+=board[k][j];
							hasConflicted[k][j]=true;
							updateScore(score);
							continue;
						}
					}
				}
			}
		}

	
	setTimeout('updateBoardView()',122);
	//alert(board);
	return true;

}




function moveDown(){

	if (!canMoveDown(board)) {
		return false;
	};

	
		for(var i=3;i>-1;i--){
			for(var j=0;j<4;j++){
				if(!board[i][j]==0){
					for(var k=3;k>i;k--){
						if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
							showMoveAnimate(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;

							//move
							continue;
						}
						else if (board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
							showMoveAnimate(i,j,k,j);
							//move	

							board[k][j]=board[i][j]+board[k][j];
							board[i][j]=0;
							//add
							score+=board[k][j];
							hasConflicted[k][j]=true;
							updateScore(score);
							continue;
						}
					}
				}
			}
		}

	
	setTimeout('updateBoardView()',122);
	//alert(board);
	return true;

}