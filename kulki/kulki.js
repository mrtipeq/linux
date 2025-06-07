const size = 9;
const colors = ['red','blue','green','yellow','purple','cyan','orange'];
let board = Array.from({length: size}, () => Array(size).fill(null));
let selected = null;
let score = 0;

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');

function randColor() { return colors[Math.floor(Math.random()*colors.length)]; }

function addRandomBalls(n=3) {
    const empties = [];
    for (let r=0;r<size;r++) for (let c=0;c<size;c++)
        if (!board[r][c]) empties.push([r,c]);
    for (let i=0;i<n && empties.length;i++) {
        const idx = Math.floor(Math.random()*empties.length);
        const [r,c] = empties.splice(idx,1)[0];
        board[r][c] = randColor();
    }
}

function createCells() {
    boardEl.innerHTML = '';
    for (let r=0;r<size;r++) {
        for (let c=0;c<size;c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => cellClick(r,c));
            if (board[r][c]) {
                const ball = document.createElement('div');
                ball.className = 'ball';
                ball.style.background = board[r][c];
                if (selected && selected[0]===r && selected[1]===c) ball.style.outline='3px solid black';
                cell.appendChild(ball);
            }
            boardEl.appendChild(cell);
        }
    }
}

function inBounds(r,c){return r>=0 && r<size && c>=0 && c<size;}

function pathExists(sr,sc,tr,tc){
    if(board[tr][tc]) return false;
    const visited = Array.from({length:size},()=>Array(size).fill(false));
    const q=[[sr,sc]];
    visited[sr][sc]=true;
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    while(q.length){
        const [r,c]=q.shift();
        if(r===tr && c===tc) return true;
        for(const[dR,dC] of dirs){
            const nr=r+dR, nc=c+dC;
            if(inBounds(nr,nc) && !visited[nr][nc] && !board[nr][nc]){
                visited[nr][nc]=true;
                q.push([nr,nc]);
            }
        }
    }
    return false;
}

function checkLines(){
    const remove = [];
    const dirs=[[1,0],[0,1],[1,1],[1,-1]];
    for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
            const color=board[r][c];
            if(!color) continue;
            for(const[dR,dC] of dirs){
                const line=[[r,c]];
                let nr=r+dR,nc=c+dC;
                while(inBounds(nr,nc) && board[nr][nc]===color){
                    line.push([nr,nc]);
                    nr+=dR; nc+=dC;
                }
                if(line.length>=5) remove.push(...line);
            }
        }
    }
    if(remove.length){
        for(const[r,c] of remove) board[r][c]=null;
        score += remove.length;
        scoreEl.textContent=score;
    }
    return remove.length>0;
}

function cellClick(r,c){
    if(selected){
        const [sr,sc]=selected;
        if(pathExists(sr,sc,r,c)){
            board[r][c]=board[sr][sc];
            board[sr][sc]=null;
            selected=null;
            if(!checkLines()){
                addRandomBalls();
                checkLines();
            }
            createCells();
            if(isFull()) alert('Koniec gry!');
            return;
        }
    }
    if(board[r][c]){
        selected=[r,c];
    } else {
        selected=null;
    }
    createCells();
}

function isFull(){
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(!board[r][c]) return false;
    return true;
}

function init(){
    addRandomBalls();
    createCells();
}

init();
