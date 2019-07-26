import React from 'react';
import logo from './logo.svg';
import './App.css';

const wrapperStyle = {
  height: '800px',
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid black',
  overflow: 'auto',
}

const gridWrapper = {
  height: '160000px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}

class MagicGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridWrapper = React.createRef();
    this.getStyleProps = this.getStyleProps.bind(this);
    this.wrapperRef = React.createRef();
    this.state = {
      start: 0,
      end: 40,
    }
  }

  getStyleProps() {
    const currentScollTop = this.wrapperRef.current.scrollTop;
    const { rowHeight } = this.props;
    let maxVisibleRows = Math.ceil(800 / rowHeight);
    let startIndex = 0;
    let endIndex;
    let currentIndex = Math.floor(currentScollTop / rowHeight);

    if (currentIndex > 0) startIndex = currentIndex
    endIndex = maxVisibleRows + currentIndex;

    this.setState({
      start: startIndex,
      end: endIndex,
    })
  }

  render() {
    return (
      <div ref={this.wrapperRef} onScroll={this.getStyleProps} style={wrapperStyle}>
        <div ref={this.gridWrapper} style={gridWrapper}>
          {
            this.props.children(this.state.start, this.state.end)
          }
        </div>
      </div>
    )
  }
}

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
      style={{ display: 'flex', width: '100%', height: '20px', background: this.state.over ? 'salmon' : '' }}>
      {this.props.number} Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
  </div>
  }
}

function App() {

  const arr = Array(8000);
  for (let i = 0; i < 8000; i++) {
    arr[i] = i;
  }

  const getRows = (start, end) => {
    if (start === -1 || end === -1) return null;
    const slice = arr.slice(start, end);
    if (slice && slice.length) {
      return slice.map((num) => {
        return <Row number={num} />
      })
    }
  }

  return (
    <div className="App">
      <div style={{ marginTop: '50px' }}>
        <MagicGrid
          rowHeight={20}>
          {(start, end) => {
            return <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed' }}>{getRows(start, end)}</div>
          }}
        </MagicGrid>
      </div>
    </div>
  );
}

export default App;
