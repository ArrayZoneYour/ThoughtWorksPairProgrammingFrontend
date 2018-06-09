import React from 'react';
import GameBoard from './GameBoard';
import Button from './Button';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      board_status: [],
      time: 0,
      row_num: 40,
      col_num: 80,
      iter_n: 30,
      refresh_second: 1000
    };
    this.getRandomIteration();
  }
  getRandomIteration = () => {
    let url = "http://localhost:8080/get_random_iteration?row_num=" + 40 +
      "&col_num=" + 80;
    axios.get(url).then(response => {
      this.setState({ history: response.data.data })
      this.setState({ board_status: response.data.data[0] });
    }).catch(error => {
      console.log(error, 'Internet Error');
    })
  }
  handleChange = (event) => {
    if (event.target.value > 0) {
      this.setState({ refresh_second: int(event.target.value)})
    }
  }
  handleClick = () => {
    this.setState({ board_status: [] })
    this.setState({ time: 0 })
    this.getRandomIteration();
  }
  renderGameBoard() {
    if (this.state.board_status.length != 0) {
      return (
        <GameBoard board_status={this.state.history[this.state.time]}
          row_num={this.state.row_num}
          col_num={this.state.col_num} />
      );
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.board_status.length != 0) {
        this.setState({ time: this.state.time + 1 })
      }
    }, this.state.refresh_second);
    // this.setState({refresh_second: value * 1000})
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {

    return (
      <div>

        <div className="float-left">
          {this.renderGameBoard()}
        </div>
        <div className="float-right control-btn">
          <input className="search-bar"
            placeholder="默认每秒1帧"
            name="refresh_second"
            onChange={this.handleChange.bind(this)}
            style={{ width: 130 }}
          />
          <button onClick={this.handleClick.bind(this)}>重新开始</button>
          {/* <Button handleClick={this.restart} /> */}
        </div>


      </div>
    );
  }
}

export default App;