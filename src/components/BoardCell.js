import React from 'react';


class BoardCell extends React.Component {

    renderCell() {
        if (this.props.state === 1) {
            return (
                <div className="board-cell-white cell"></div>
            );
        } else {
            return (
                <div className="board-cell-black cell"></div>
            );
        }
    }

    render() {
        return (
            <div className="float-left" onClick={this.props.cellClick}>
                {this.renderCell()}
            </div>
        );
    }
}

export default BoardCell;