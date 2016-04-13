// session vars
squareSelected = function squareSelected(x, y) {
	var selectedSquares = Session.get('boardPageselectedSquares');
	var sq = selectedSquares.filter(function(ele) {
		return(ele.x == x && ele.y == y);
	})
	return sq.length > 0;
}
gameIsSelected = function gameIsSelected(gameID) {
	var selectedGames = Session.get('boardPageselectedGames');
	return selectedGames.indexOf(gameID) != -1
}
squareContainsSelectedGame = function squareContainsSelectedGame(matrix, x, y) {
	if (!matrix) return false;
	var squareGames = matrix[x][y];
	for (var i = 0; i < squareGames.length; i++) {
		if (gameIsSelected(squareGames[i]._id))
			return true;
	}
	return false;
}