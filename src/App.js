import React from 'react';
import logo from './logo.svg';
import './App.css';
import ShortList from './ShortList';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.updateBg = this.updateBg.bind(this);
    this.state = {
      over: false,
    }
  }

  updateBg(val) {
    this.setState({
      over: val
    })
  }

  render() {
    return <div
      onMouseOut={() => { this.updateBg(false) }}
      onMouseOver={() => { this.updateBg(true) }}
      style={{ display: 'flex', width: '100%', background: this.state.over ? 'salmon' : '', ...this.props.style }}>
      {this.props.number} Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
  </div>
  }
}

function App() {
  const arr = Array(2000);
  for (let i = 0; i < 2000; i++) {
    arr[i] = i;
  }

  const getRows = (start, end) => {
    const slice = arr.slice(start, end);
    return slice.map((num) => {
      return <Row number={num} />
    })
  }

  return (
    <div className="App">
      <ShortList
        listStyle={{ height: '800px', border: '1px solid #eee', width: '800px' }}
        totalRows={2000}
        rowHeight={40}>
        {(start, end) => {
          return getRows(start, end)
        }}
      </ShortList>
    </div>
  );
}

export default App;
