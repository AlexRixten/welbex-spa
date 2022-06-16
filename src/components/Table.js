import React from 'react'

export const Table = (props) => {
  let curData = []
  const { items, requestSort, sortConfig } = props.useSortableData(props.filter);
  items.map((item) => {
    curData.push(item)
  })
  let currentData = curData.slice(props.firsDataIndex,props.lastDataIndex)

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? (sortConfig.direction !== 'descending' ? 'upsort' : 'downsort') : ''
  };


  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">
              <button
                type="button"
                onClick={() => requestSort('name')}
                className={getClassNamesFor('name')}
              >
                Название
              </button>
            </th>
            <th scope="col">
              <button
                type="button"
                onClick={() => requestSort('count')}
                className={getClassNamesFor('count')}
              >
                Значение
              </button>
            </th>
            <th scope="col">
              <button
                type="button"
                onClick={() => requestSort('space')}
                className={getClassNamesFor('space')}
              >
                Расcтояние
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.name}</td>
              <td>{item.count}</td>
              <td>{item.space}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
