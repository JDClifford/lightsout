import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
	static defaultProps = {
		nrows: 4,
		ncols: 4,
		chanceLightStartsOn: 0.5
	};

	constructor(props) {
		super(props);
		this.state = { hasWon: false, board: this.createBoard() };
		this.createBoard = this.createBoard.bind(this);
		this.flipCellsAround = this.flipCellsAround.bind(this);
		this.randomDraw = this.randomDraw.bind(this);
		this.drawBoard = this.drawBoard.bind(this);
		this.restartGame = this.restartGame.bind(this);
	}

	randomDraw() {
		let x = Math.random();
		if (x < this.props.chanceLightStartsOn) {
			return true;
		} else {
			return false;
		}
	}

	createBoard() {
		let board = [];
		for (let x = 0; x < this.props.nrows; x++) {
			board.push([]);
			for (let y = 0; y < this.props.ncols; y++) {
				board[x][y] = this.randomDraw();
			}
		}
		return board;
	}

	flipCellsAround(coord) {
		let { ncols, nrows } = this.props;
		let board = this.state.board;
		let [ y, x ] = coord.split('-').map(Number);
		let winnerCount = 0;
		flipCell(y, x);

		function flipCell(y, x) {
			if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
				board[y][x] = !board[y][x];

				if (typeof board[y + 1] !== 'undefined') board[y + 1][x] = !board[y + 1][x];

				if (typeof board[y - 1] !== 'undefined') board[y - 1][x] = !board[y - 1][x];

				if (typeof board[x + 1] !== 'undefined') board[y][x + 1] = !board[y][x + 1];

				if (typeof board[x - 1] !== 'undefined') board[y][x - 1] = !board[y][x - 1];
			}
		}

		//Checks if game is won after tiles change
		board.forEach((arr) => (!arr.includes(false) ? winnerCount++ : winnerCount));
		winnerCount === this.props.nrows ? this.setState({ hasWon: true }) : this.setState({ hasWon: false });
	}

	drawBoard() {
		return this.state.board.map((val, idx1) => (
			<div>
				{val.map(
					(bool, idx2) =>
						bool === true ? (
							<Cell
								key={idx1 + idx2}
								isLit={true}
								coord={idx1 + '-' + idx2}
								flipCellsAroundMe={this.flipCellsAround}
							/>
						) : (
							<Cell
								key={idx1 + idx2}
								isLit={false}
								coord={idx1 + '-' + idx2}
								flipCellsAroundMe={this.flipCellsAround}
							/>
						)
				)}
			</div>
		));
	}

	restartGame() {
		this.setState({ hasWon: false, board: this.createBoard() });
	}

	render() {
		return this.state.hasWon ? (
			<div className='Board'>
				<span className='neon'>You</span> <span className='flux'>win!</span>
				<button onClick={this.restartGame}>Play Again?</button>
			</div>
		) : (
			<div className='Board'>
				<div className='container'>
					<span className='neon'>Lights</span>
					<span className='flux'>Out</span>
				</div>
				{this.drawBoard()}
			</div>
		);
	}
}

export default Board;
