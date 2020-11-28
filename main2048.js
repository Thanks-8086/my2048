var board = new Array(4);//游戏格子
var score = 0;
var hasConflicted = new Array();

$(document).ready(function(){
    newgame();
});

function newgame(){
    //初始化棋盘格
    init();
    //在随即格子里生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(let i=0;i<4;i++){
        board[i] = new Array(4);
        hasConflicted[i] = new Array(4);
        for(let j=0;j<4;j++){
            var gridCell=$("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left', getPosLeft(i,j));

            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    //console.log(board);
    updateBoardView();//重开

    score=0;
}

function updateBoardView(){

    $(".number-cell").remove();
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] === 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+50);
                theNumberCell.css('left',getPosLeft(i,j)+50);
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
                if(board[i][j]>100){
                    theNumberCell.css('font-size', '50px');
                }
                if(board[i][j]>1000){
                    theNumberCell.css('font-size', '40px');
                }
            }
            hasConflicted[i][j] = false;
        }
    }  
}

function generateOneNumber(){

    if(nospace(board)){
        return false;
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    let times = 50;
    while(--times){
        if(board[randx][randy] === 0){
            break;
        }
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
    }
    if(!times){
        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                if(!board[i][j])
                    randx = i;
                    randy = j;
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() <0.5 ? 2: 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function(event){
    event.preventDefault();
    switch(event.keyCode){
        case 37: //left
            if(moveLeft()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
            break;
        case 38: //up
            if(moveUp()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
            break;
        case 39: //right
            if(moveRight()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
            break;
        case 40: //down
            if(moveDown()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
            break;
        default:
            break;
    }
});
 
document.addEventListener('touchstart', function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
})
document.addEventListener('touchend', function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentHeight){
        return;
    }
    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //move right
            if(moveRight()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
        }else{
            //move left
            if(moveLeft()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
        }
    }else{
        if(deltay > 0){
            //move down
            if(moveDown()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
        }else{
            //move up
            if(moveUp()){
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameover(), 300);
            }
        }
    }
})

function isGameover(){
    if(nospace(board) && nomove(board)){
        isGameover();
    }
}

function gameover(){
    alert("游戏结束！");
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    //moveLeft
    for(let i=0; i<4; i++){
        for(let j=1; j<4; j++){
            if(board[i][j] !== 0){
                for(let k=0; k<j; k++){
                    if(board[i][k] === 0 && noBlockHorizonTal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i ,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k] === board[i][j] && noBlockHorizonTal(i, k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //addscore
                        score+= board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 200);
    return true;
}
function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    //moveRight
    for(let i=0; i<4; i++){
        for(let j=2; j>=0; j--){
            if(board[i][j] !== 0){
                for(let k=3; k>j; k--){
                    if(board[i][k] === 0 && noBlockHorizonTal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i ,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k] === board[i][j] && noBlockHorizonTal(i, k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //addscore
                        score+= board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 200);
    return true;
}
function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //moveUp
    for(let j=0; j<4; j++){
        for(let i=1; i<4; i++){
            if(board[i][j] !== 0){
                for(let k=0; k<i; k++){
                    if(board[k][j] === 0 && noBlockVertical(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k ,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //addscore
                        score+= board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 200);
    return true;
}
function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    //moveDown
    for(let j=0; j<4; j++){
        for(let i=2; i>=0; i--){
            if(board[i][j] !== 0){
                for(let k=3; k>i; k--){
                    if(board[k][j] === 0 && noBlockVertical(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k ,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //addscore
                        score+= board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 200);
    return true;
}