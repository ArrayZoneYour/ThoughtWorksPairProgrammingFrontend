import React from 'react';
import GameBoard from './GameBoard';
import axios from 'axios';
import querystring from 'querystring'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      board_status: [],
      time: 0,
      row_num: 40,
      col_num: 88,
      iter_n: 30,
      refresh_second: 1000,
      total_iteration: 100,
      pause: false
    };
    this.getRandomIteration();
  }
  getRandomIteration = () => {
    let url = "http://localhost:8080/get_random_iteration";
    let data = new FormData()
    data.append('row_num', this.state.row_num);
    data.append('col_num', this.state.col_num);
    axios.post(url, data).then(response => {
      let history = this.state.history;
      history.push(...response.data.data)
      this.setState({ history: history })
      this.setState({ board_status: response.data.data[this.state.time] });
    }).then(() => {
      if (this.state.history.length < 100) {
        this.getNextIteration();
      }
    }).catch(error => {
      console.log(error, 'Internet Error');
    })
  }
  getNextIteration = () => {
    let url = "http://localhost:8080/get_custom_iteration";
    let data = new FormData()
    data.append('row_num', this.state.row_num);
    data.append('col_num', this.state.col_num);
    data.append('initial_board', JSON.stringify(this.state.history[this.state.history.length - 1]))
    axios.post(url, data).then(response => {
      let history = this.state.history;
      history.push(...response.data.data)
      this.setState({ history: history })
      this.setState({ board_status: response.data.data[this.state.time] });
    }).catch(error => {
      console.log(error, 'Internet Error');
    })
  }
  handleClick = () => {
    this.setState({ board_status: [] });
    this.setState({ time: 0 });
    this.setState({ total_iteration: 100 });
    this.getRandomIteration();
  }
  continueInteration = () => {
    let url = "http://localhost:8080/get_custom_iteration";
    let data = new FormData()
    data.append('row_num', this.state.row_num);
    data.append('col_num', this.state.col_num);
    data.append('initial_board', JSON.stringify(this.state.history[this.state.history.length - 1]))
    axios.post(url, data).then(response => {
      let history = this.state.history;
      history.push(...response.data.data)
      this.setState({ history: history })
      this.setState({ board_status: response.data.data[this.state.time] });
    }).then(() => {
      this.setState({ total_iteration: this.state.total_iteration + 100 })
      if (this.state.history.length < this.state.total_iteration) {
        this.getNextIteration();
        this.changeSpeed(1);
      }
    }).catch(error => {
      console.log(error, 'Internet Error');
    })
  }
  changeSpeed = (speed) => {
    self = this;
    let promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(self.setState({ refresh_second: 1000 / speed }))
      }, 100);
    })
    promise.then(() => {
      clearInterval(self.interval);
    }).then(() => {
      self.interval = setInterval(() => {
        if (self.state.history.length != 0 && self.state.time < this.state.total_iteration - 1) {
          self.setState({ time: self.state.time + 1 })
        }
      }, self.state.refresh_second);
    })

  }
  cellClick = (row, col) => {
      console.log(this.state, row, col, this.state.time)
      let history = this.state.history
      let board_status = this.state.history[this.state.time];
      board_status[row][col] = 1 - board_status[row][col]
      history[this.state.time] = board_status
      this.setState({ history: history })
  }
  pause = () => {
    clearInterval(this.interval);
    this.setState({ pause: true });
  }
  continue = () => {
    this.interval = setInterval(() => {
      if (this.state.history.length != 0 && this.state.time < this.state.total_iteration - 1) {
        this.setState({ time: this.state.time + 1 })
      }
    }, this.state.refresh_second);
    this.setState({ pause: false });
  }
  renderGameBoard() {
    if (this.state.history.length != 0) {
      return (
        <GameBoard board_status={this.state.history[this.state.time]}
          row_num={this.state.row_num}
          col_num={this.state.col_num}
          cellClick={this.cellClick} />
      );
    } else {
      return (
        <div className="black-full-background">加载中...... 请稍等</div>
      );
    }
  }
  renderPauseOrContinueButton() {
    if (this.state.pause) {
      return (
        <button className="btn btn-success" onClick={() => this.continue()}>继续</button>
      );
    } else {
      return (
        <button className="btn btn-warning" onClick={() => this.pause()}>暂停</button>
      );
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.history.length != 0 && this.state.time < this.state.total_iteration - 1) {
        this.setState({ time: this.state.time + 1 })
      }
    }, this.state.refresh_second);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {

    return (
      <div>

        <div className="center">
          {this.renderGameBoard()}
        </div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow={(this.state.time + 1) / this.state.total_iteration * 100} aria-valuemin="0" aria-valuemax="50" style={{ width: (this.state.time + 1) / this.state.total_iteration * 100 + '%' }}>
            {this.state.time + 1} / {this.state.total_iteration}
          </div>
        </div>
        <div className="float-right control-btn">
          {this.renderPauseOrContinueButton()}
          <button className="btn btn-primary" onClick={() => this.changeSpeed(1)}>一倍速</button>
          <button className="btn btn-primary" onClick={() => this.changeSpeed(2)}>两倍速</button>
          <button className="btn btn-primary" onClick={() => this.changeSpeed(5)}>五倍速</button>
          <button className="btn btn-info" onClick={() => this.continueInteration()}> 继续当前任务</button>
          <button className="btn btn-danger" onClick={this.handleClick.bind(this)}> 重新开始</button>
        </div>


      </div>
    );
  }
}

export default App;