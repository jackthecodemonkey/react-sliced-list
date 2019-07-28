import React from 'react';
import logo from './logo.svg';
import './App.css';

const wrapperStyle = {
  height: '820px',
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid black',
  overflow: 'auto',
}

const gridWrapper = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}

const gridWrapperStyle = (height) => {
  return {
    ...gridWrapper,
    height: `${height}px`,
  }
}

const getStyleProp = (str) => Number(str.replace('px', ''));

class SmallScroll extends React.Component {
  constructor(props) {
    super(props);
    this.gridWrapper = React.createRef();
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.wrapperRef = React.createRef();
    this.state = {
      start: 0,
      end: 0,
    }
  }

  componentDidMount() {
    const { height } = this.getWrapperStyle();
    this.setState({
      end: Math.ceil(height / this.props.rowHeight),
    })
  }

  getWrapperStyle(wrapper = this.wrapperRef) {
    const wrapperStyles = window.getComputedStyle(wrapper.current);
    const height = getStyleProp(wrapperStyles.height);
    return { height };
  }

  get maxVisibleRows() {
    const { height } = this.getWrapperStyle();
    return Math.ceil(height / this.props.rowHeight);
  }

  rowStartIndex(startIndex) {
    return startIndex > 2
      ? startIndex - 1
      : startIndex
  }

  rowEndIndex(startIndex, endIndex) {
    return startIndex <= 2
      ? endIndex + 1
      : endIndex
  }

  handleOnScroll() {
    const currentScollTop = this.wrapperRef.current.scrollTop;
    let startIndex = 0;
    let endIndex;
    let currentIndex = Math.floor(currentScollTop / this.props.rowHeight);

    if (currentIndex > 0) startIndex = currentIndex
    endIndex = this.maxVisibleRows + currentIndex;

    this.setState({
      start: this.rowStartIndex(startIndex),
      end: this.rowEndIndex(startIndex, endIndex),
      scrollTop: currentScollTop
    })
  }

  renderChildren(rows) {
    let first = [];
    if (this.state.start) {
      let rest = Math.floor(this.state.scrollTop / this.props.rowHeight);
      let offset = 0;
      let lastPage = this.props.totalRows - this.maxVisibleRows;
      if (this.endIndex > lastPage) {
        offset = 1;
      }
      for (let i = 0; i < rest - offset; i++) {
        first.push(<div style={{ height: `${this.props.rowHeight}px` }}></div>);
      }
      return first.concat(rows);
    }
    const rowsToRender = first.length
      ? first
      : rows;
    if (!rowsToRender.length) return null;
    return <div style={{ display: 'flex', flexDirection: 'column' }}>{rowsToRender}</div>;
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        onScroll={this.handleOnScroll}
        style={wrapperStyle}>
        <div ref={this.gridWrapper} style={gridWrapperStyle(this.props.totalRows * this.props.rowHeight)}>
          {
            this.state.end > 0 &&
            this.renderChildren(this.props.children(this.state.start, this.state.end, this.state.scrollTop))
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
      style={{ display: 'flex', width: '100%', height: '40px', background: this.state.over ? 'salmon' : '' }}>
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
      <div style={{ marginTop: '50px' }}>
        <SmallScroll
          totalRows={2000}
          rowHeight={40}>
          {(start, end) => {
            return getRows(start, end)
          }}
        </SmallScroll>
      </div>
    </div>
  );
}

export default App;
