import React from 'react';
import logo from './logo.svg';
import './App.css';

const wrapperStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  overflowY: 'auto',
  position: 'relative',
}

const gridWrapper = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const getWrapperStyle = (style = {}) => {
  return {
    ...wrapperStyle,
    ...style
  }
}

const gridWrapperStyle = (height) => {
  return {
    ...gridWrapper,
    height: `${height}px`,
  }
}

const getStyleProp = (str) => Number(str.replace('px', ''));

class ShortList extends React.Component {
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
    this.setState({ end: Math.ceil(height / this.props.rowHeight) })
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

  handleOnScroll() {
    const currentScollTop = this.wrapperRef.current.scrollTop;
    let startIndex = 0;
    let endIndex;
    let currentIndex = Math.floor(currentScollTop / this.props.rowHeight);

    if (currentIndex > 0) startIndex = currentIndex
    endIndex = this.maxVisibleRows + currentIndex;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    this.setState({
      start: startIndex,
      end: endIndex + 1,
    })
  }

  getRow(top, child) {
    return <div
      style={{
        top: `${top}px`,
        height: `${this.props.rowHeight}px`,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}>
      {child}
    </div>
  }

  getRowTopValue(index) {
    return (this.state.start + index) * this.props.rowHeight;
  }

  renderChildren(rows) {
    const children = React.Children.map(rows, (child, index) => {
      return this.getRow(this.getRowTopValue(index), child);
    })
    return <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>;
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        onScroll={this.handleOnScroll}
        style={getWrapperStyle(this.props.listStyle)}>
        <div ref={this.gridWrapper} style={gridWrapperStyle(this.props.totalRows * this.props.rowHeight)}>
          {
            this.state.end > 0 &&
            this.renderChildren(this.props.children(this.state.start, this.state.end))
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
      <div style={{ marginTop: '50px' }}>
        <ShortList
          listStyle={{
            height: '800px',
            border: '1px solid black',
          }}
          totalRows={2000}
          rowHeight={40}>
          {(start, end) => {
            return getRows(start, end)
          }}
        </ShortList>
      </div>
    </div>
  );
}

export default App;
