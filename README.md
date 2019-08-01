## Simple React component

**Render only partial items from your long list for better performace**

Render 20,000 rows with mouse hover event

With 

![Screenshot](/public/screenshot/applied.gif)

Without ( very slow on changing row background )

![Screenshot](/public/screenshot/without.gif)

| Parameters  | Type | Description | Required |
| ------------| ---- | ----------- | -------- |
| totalRows   | Number | Total number of rows we want to render | Yes | 
| rowHeight   | Number | Height of each row | Yes |
| children   | React elements | List of React elements we want to render | Yes |
| listStyle   | Object | Optional style object for list wrapper | No |

This example shows how to use the component.
We get `start` and `end` values via children. use these values to slice your list.

```
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
```
