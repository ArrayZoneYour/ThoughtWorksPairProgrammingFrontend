import React from 'react';
import BoardCell from './BoardCell';

class GameBoard extends React.Component {

    render_n_cells = (row_num, col_num) => {
        let result = [];
        for (let i = 0; i < col_num; i++) {
            // console.log(row_num + ' ' + i);
            result.push(<BoardCell key={ col_num * row_num + i }
                                   row_num={row_num}
                                   col_num={col_num}
                                   i={i}
                                   state={ this.props.board_status[parseInt(row_num)][i]} 
                                   cellClick={() => this.props.cellClick(parseInt(row_num), i)} />);
        }
        return result;
    }
    
    render_board = (row_num, col_num) => {
        let result = [];
        for (let i = 0; i < row_num; i++) {
            result.push(
                <div className="row" key={i}>
                    {this.render_n_cells(i, col_num)}
                </div>
             );
        }
        return result;
    }

    render() {
        return (
            <div>
                { this.render_board(this.props.row_num, this.props.col_num) }
            </div>
        );
    }
}

export default GameBoard;