# Squares
A Meteorjs web application allowing users to create and participate in NCAA squares game. A beta version is currently hosted at [squares.webhop.me](http://squares.webhop.me/).

### Game Dynamics
Members of a board select their alloted number of squares within a 10 x 10 grid. When the owner locks the board numbers between 0-9 are randomly assigned to each row and column.

The column number represents the last digit in the score of the winning team and the row number represents the last digit in the score of the losing team.

e.g. if a selected square randomly got the column number 5 and row number 7, that squares would win any NCAA tournament game played where the winning score has last digit 5 and the losing score has the last digit 7. 


### Setting up a game
From the root url select _create board_ 
from within the newly created board page, a board owner can:

1. _Invite_ new users with a username and email, an email invitation will be sent to the specified email address
2. _Edit_ the board by selecting multiple squares and taking bulk assignment actions
3. _Lock_ the board at any time
4. increase/decarease a specific users # of square or mark a user as _paid_
