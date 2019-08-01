import React from 'react';
import SlicedList from '../slicedList';
import { shallow } from 'enzyme';

const arr = Array(1000);
for (let i = 0; i < 1000; i++) {
    arr[i] = i;
}

let wrapperHeight;

window.getComputedStyle = () => {
    return {
        height: `${wrapperHeight}px`,
    }
}

const getRows = (start, end) => {
    const slice = arr.slice(start, end);
    return slice.map((num) => {
        return <div>{num}</div>
    })
}

let wrapper = null;
let startIndex = 0;
let endIndex = 0;

describe('SlicedList', () => {
    beforeEach(() => {
        wrapperHeight = 850;
        wrapper = shallow(
            <SlicedList
                totalRows={2000}
                rowHeight={40}>
                {(start, end) => {
                    startIndex = start;
                    endIndex = end;
                    return getRows(start, end)
                }}
            </SlicedList>
        );
    })

    it('maxVisibleRows should be 22', () => {
        expect(wrapper.instance().maxVisibleRows).toEqual(22);
    });

    it('maxVisibleRows should be 34', () => {
        wrapperHeight = 1350;
        expect(wrapper.instance().maxVisibleRows).toEqual(34);
    });

    it('Initial start and end index', () => {
        expect(startIndex).toEqual(0);
        expect(endIndex).toEqual(22);
    });

    it('Simulating scroll move', () => {
        wrapper.instance().updateIndexes(40);
        expect(startIndex).toEqual(0);
        expect(endIndex).toEqual(24);

        wrapper.instance().updateIndexes(79);
        expect(startIndex).toEqual(0);
        expect(endIndex).toEqual(24);

        wrapper.instance().updateIndexes(80);
        expect(startIndex).toEqual(1);
        expect(endIndex).toEqual(25);
    });

    it("Top property values update", () => {
        wrapper.instance().updateIndexes(120);
        expect(wrapper.instance().getRowTopValue(0)).toEqual(80);
        expect(wrapper.instance().getRowTopValue(5)).toEqual(280);
    });

    it("Get a single row", () => {
        wrapper.instance().updateIndexes(120);
        const row = wrapper.instance().getRow(200, <span>Test</span>);
        expect(React.isValidElement(row)).toEqual(true);
        expect(row.type).toEqual('div');
        expect(row.props.style.top).toEqual('200px');
        expect(row.props.children.type).toEqual('span');
    })
})


