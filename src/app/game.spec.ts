describe('Game', () => {
  it('shows an empty board when created', () => {
    const game = new Game(new MineMap(2, 3));
    expect(game.getBoard()).toEqual([
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ])
  });

  it('shows a number of mines around when clicked', () => {
    const game = new Game(
      new MineMap(3, 3)
        .withMineAt(0, 0)
        .withMineAt(0, 1)
    );
    game.open(1, 1);
    expect(game.getBoard()).toEqual([
      [' ', ' ', ' '],
      [' ', '2', ' '],
      [' ', ' ', ' '],
    ])

  });
});

class Game {
  private board: Board;

  constructor(private readonly map: MineMap) {
    this.board = [];
    for (let r = 0; r < map.height; r++) {
      this.board[r] = [];
      for (let c = 0; c < map.width; c++) {
        this.board[r][c] = ' ';
      }
    }
  }

  getBoard(): Board {
    return this.board;
  }

  open(row: number, col: number): void {
    if (this.board[row][col] !== ' ') {
      return;
    }
    const neighbors = [-1, 0, 1];
    let n = 0;
    for (let r of neighbors.map(v => v + row)) {
      for (let c of neighbors.map(v => v + col)) {
        if (this.map.hasMineAt(r, c)) {
          n++;
        }
      }
    }
    this.board[row][col] = n.toString(10);
  }
}

type Board = string[][];

class MineMap {
  constructor(readonly height: number,
              readonly width: number,
              private readonly map: Set<number> = new Set()) {
  }

  hasMineAt(row: number, col: number): boolean {
    return row >= 0
      && row < this.height
      && col >= 0
      && col < this.width
      && this.map.has(this.toOffset(row, col));
  }

  withMineAt(row: number, col: number): self {
    return new MineMap(
      this.height,
      this.width,
      this.map.add(this.toOffset(row, col))
    );
  }

  private toOffset(row: number, col: number): number {
    return row * this.width + col;
  }
}
