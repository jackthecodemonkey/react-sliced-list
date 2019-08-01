import React from 'react';
import SlicedList from './slicedList';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.showBg = this.showBg.bind(this);
    this.hideBg = this.hideBg.bind(this);
    this.state = {
      show: false,
    }
  }

  showBg() {
    this.setState({
      show: true,
    })
  }

  hideBg() {
    this.setState({
      show: false,
    })
  }

  render() {
    const {
      props,
    } = this;

    let bg = props.number % 2 === 0 ? '#fcffff' : '#f2fcfb';
    if (this.state.show) bg = 'lightskyblue';
    return (
      <div
        onMouseOver={this.showBg}
        onMouseLeave={this.hideBg}
        style={{ display: 'flex', width: '100%', flexDirection: 'column', background: bg, padding: '10px', }}>
        {props.number}
      </div>
    )
  }
}

function App() {
  const arr = Array(20000);
  for (let i = 0; i < 20000; i++) {
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
      <SlicedList
        listStyle={{ height: '400px', width: '400px' }}
        totalRows={20000}
        rowHeight={40}>
        {(start, end) => {
          return getRows(start, end)
        }}
      </SlicedList>
    </div>
  );
}

export default App;
