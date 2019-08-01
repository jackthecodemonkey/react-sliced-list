import React from 'react';
import PropTypes from 'prop-types';

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
    width: '100%',
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

class SlicedList extends React.Component {
    constructor(props) {
        super(props);
        this.gridWrapper = React.createRef();
        this.wrapperRef = React.createRef();
        this.handleOnScroll = this.handleOnScroll.bind(this);
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

    updateIndexes(scrollTop) {
        let startIndex = 0;
        let endIndex;
        let currentIndex = Math.floor(scrollTop / this.props.rowHeight);

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

    handleOnScroll() {
        this.updateIndexes(this.wrapperRef.current.scrollTop);
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

SlicedList.propTypes = {
    totalRows: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    listStyle: PropTypes.shape({}),
}

SlicedList.defaultProps = {
    listStyle: {},
}

export default SlicedList;
