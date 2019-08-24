var winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var squareCount = 9;
var squares = document.getElementsByClassName("square");
var difficulty = "moron";//难易程度；moron：白痴级别；genius：天才级别
var gameOver = false;

function setMessageBox(value) {
    var messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = value;
}

var secureWin = function () {
    return makeMove("O");
}

var preventDefeat = function () {
    return makeMove("X")
}

var makeMove = function (marker) {
    var moveMade = false;
    for (var i = 0; i < winConditions.length; i++) {
        var count = 0;
        for (var j = 0; j < winConditions[i].length; j++) {
            if (marker === document.getElementById(winConditions[i][j]).innerHTML) {
                count++;
            }
        }
        if (count == 2) {
            for (j = 0; j < winConditions[i].length; j++) {
                var square = document.getElementById(winConditions[i][j]);
                if (squareIsOpen(square)) {
                    square.innerHTML = "O";
                    moveMade = true;
                    break;
                }
            }
        }
        if (moveMade) {
            break;
        }
    }
    return moveMade;
}

var resetGame = function () {
    gameOver = false;
    setMessageBox("选择一个格子");
    for (var i = 0; i < squareCount; i++) {
        var square = document.getElementById(i);
        square.innerHTML = "";
        square.style.backgroundColor = "#F0f2f5";
    }
};

var squareIsOpen = function (value) {
    return (value.innerHTML !== "X" && value.innerHTML !== "O");
};

var findClaimedSquares = function (marker) {
    var claimedSquares = [];
    var value;
    for (var i = 0; i < squareCount; i++) {
        value = document.getElementById(i).innerHTML;
        if (value === marker) {
            claimedSquares.push(i);
        }
    }
    return claimedSquares;
}

var checkForWinCondition = function (marker) {
    var claimedSquares = findClaimedSquares(marker);
    var win = false;
    for (var i = 0; i < winConditions.length; i++) {
        win = winConditions[i].every(element => claimedSquares.indexOf(element) > -1);
        if (win) {
            win = winConditions[i];
            break;
        }
    }
    return win;
};

var opponentMove = function () {
    if (difficulty === "moron") {
        makeMoveAtFirstAvailableSquare();
    } else {
        var moveMade = secureWin();
        if (!moveMade) {
            moveMade = preventDefeat();
            if (!moveMade) {
                var center = document.getElementById(4);
                if (squareIsOpen(center)) {
                    center.innerHTML = "O";
                } else {
                    makeMoveAtFirstAvailableSquare();
                }
            }
        }
    }
}

var makeMoveAtFirstAvailableSquare = function () {
    for (var i = 0; i < squareCount; i++) {
        square = document.getElementById(i);
        if (squareIsOpen(square)) {
            square.innerHTML = "O";
            break;
        }
    }
}

var checkForDraw = function () {
    var draw = true;
    for (var i = 0; i < squareCount; i++) {
        if (squareIsOpen(document.getElementById(i))) {
            draw = false;
            break;
        }
    }
    return draw;
}

var highlightWinnningSquares = function (winningSquares, color) {
    for (var i = 0; i < winningSquares.length; i++) {
        document.getElementById(winningSquares[i]).style.backgroundColor = color;
    }
}

var chooseSquare = function () {
    difficulty = document.getElementById("difficulty").value;
    if (!gameOver) {
        setMessageBox("选择一个格子");
        var id = this.getAttribute("id");
        var square = document.getElementById(id);
        if (squareIsOpen(square)) {
            square.innerHTML = "X";
            var win = checkForWinCondition("X");
            if (!win) {
                opponentMove();
                var lost = checkForWinCondition("O");
                if (!lost) {
                    var draw = checkForDraw();
                    if (draw) {
                        gameOver = true;
                        setMessageBox("平局!")
                    }
                } else {
                    gameOver = true;
                    highlightWinnningSquares(lost, '#21cbd1');
                    setMessageBox("你输了!")
                }
            } else {
                gameOver = true;
                highlightWinnningSquares(win, '#21cbd1');
                setMessageBox("你赢了!");
            }
        } else {
            setMessageBox("此格子已被占用!");
        }
    }
}

for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', chooseSquare, false);
}