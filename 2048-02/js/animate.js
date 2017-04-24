/**
 * @author Dodd
 */
 
function showNumberAnimate(i,j,randomNum){
	var numberCell=$('#number_cell_'+i+'_'+j+'');
	numberCell.css('color', getNumberColol(randomNum));
	numberCell.css('background-color',getBackgroundColor(randomNum));
	numberCell.text(randomNum);


	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getTop(i,j),
		left:getLeft(i,j)
	},122)

}

function showMoveAnimate(fromX,fromY,toX,toY){
	var numberCell=$('#number_cell_'+fromX+'_'+fromY+'');
	


	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getTop(toX,toY),
		left:getLeft(toX,toY)
	},122)

}


function updateScore(score){

	$('#score').html(score+"");
}