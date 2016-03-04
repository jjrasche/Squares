/* board format

{
	name: 
	winnerNumbers:
	loserNumbers:
	sq00: {memberID}
	sq01: {memberID}
	...
	...
	sq99: {memberID}
}

*/



// var takeSquare = function (){
// 	Board.update{boardData
// }

formatBoardData = function formatBoardData(boardData) {
	var boardArray = []
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var key = getSquareKey(i,j);
			//console.log(key, boardData[key]);
			boardArray.push([i,j,formatCellData(boardData[key])]);
		}
	}
	// console.log(JSON.stringify(boardArray));
	return boardArray;
}

formatCellData = function formatCellData(cellData) {
	return cellData;
}

