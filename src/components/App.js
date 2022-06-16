import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Table } from './Table';
import DATA from '../DATA';
import { Filter } from './Filter';
import { Pagination } from './Pagination';
import Preloader from './common/Preloader/Preloader';

const dataSelect = [
  {
    id: 1,
    name: 'Columns',
    models: [
      {
        id: 0,
        name: 'Выберете название колонки',
      },
      {
        id: 1,
        name: 'Название'
      },
      {
        id: 2,
        name: 'Значение',
      },
      {
        id: 3,
        name: 'Расстояние',
      },
    ]
  },
  {
    id: 2,
    name: 'Condition',
    models: [
      {
        id: 0,
        name: 'Выберите условие'
      },
      {
        id: 1,
        name: '= (равно)',
      },
      {
        id: 2,
        name: '∈ (содержит)',
      },
      {
        id: 3,
        name: '> (больше)',
      },
      {
        id: 4,
        name: '< (меньше)',
      },
    ]
  }
];

const values = ['name', 'count', 'space'];

function App() {

  const [column, setColumn] = useState(0);
  const [condition, setCondition] = useState(0);
  const [text, setText] = useState('');
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [dataPerPage] = useState(10)
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      await axios.get(
        `https://api-generator.retool.com/QEq0zl/cities`
      ).then((response) => {
        setData(response.data);
        setLoading(false)
      });
    }
    getData()
  }, []);

  const lastDataIndex = page * dataPerPage
  const firsDataIndex = lastDataIndex - dataPerPage
  const currentData = filtered.slice(firsDataIndex, lastDataIndex)
  const paginate = pageNumber => setPage(pageNumber)

  const search = (val, col, con) => {
    //текущие задачи и новые отфильтрованные задачи
    let currentData = [], newList = [];
    if (val !== "" && col !== 0 && con !== 0) {
      currentData = data;
      if (con === 2) {
        newList = currentData.filter(data => {
          if (typeof (data[values[col - 1]]) === 'string') {
            return data[values[col - 1]].toLowerCase().includes(val.toLowerCase());
          }
          else {
            return `${data[values[col - 1]]}`.includes(val);
          }
        })
      }
      else if (con === 1) {
        newList = currentData.filter(data => {
          if (typeof (data[values[col - 1]]) === 'string') {
            if (data[values[col - 1]].toLowerCase() === val.toLowerCase()) {
              return data
            }
          }
          else {
            if (data[values[col - 1]] === +val) {
              return data
            }
          }
        })
      }
      else if (con === 3) {
        newList = currentData.filter(data => {
          if (typeof (data[values[col - 1]]) === 'string') {
            if (data[values[col - 1]].toLowerCase() > val.toLowerCase()) {
              return data
            }
          }
          else {
            if (data[values[col - 1]] > +val) {
              return data
            }
          }
        })
      }
      else if (con === 4) {
        newList = currentData.filter(data => {
          if (typeof (data[values[col - 1]]) === 'string') {
            if (data[values[col - 1]].toLowerCase() < val.toLowerCase()) {
              return data
            }
          }
          else {
            if (data[values[col - 1]] < +val) {
              return data
            }
          }
        })
      }
    } else {
      newList = data;
    }
    setFiltered(newList);
  };

  useEffect(() => {
    setFiltered(data);
  }, [data]);

  useEffect(() => {
    search(text, +column, +condition)
  }, [text, column, condition])

  const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
      let sortableItems = [...items];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
      let direction = 'ascending';
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
      ) {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
  };


  return (
    (loading ?
      <div className='wrapper'>
        <Preloader />
      </div>
      :
      <div className='container'>
        <div className="row mt-5 mb-5 align-items-center">
          <div className="col-md-4 text-md-center text-sm-start mb-sm-3">
            <select className='btn btn-secondary' value={column} onChange={(event) => {
              setColumn(event.target.value)
            }}>
              {dataSelect[0].models.map((item) => {
                return <option key={item.id} value={item.id}>{item.name}</option>;
              })}
            </select>
          </div>
          <div className="col-md-3 text-md-center text-sm-start mb-sm-3">
            <select className='btn btn-secondary' value={condition} onChange={(event) => {
              setCondition(event.target.value)
            }}>
              {dataSelect[1].models.map((item) => {
                return <option key={item.id} value={item.id}>{item.name}</option>;
              })}
            </select>
          </div>
          <div className="col-md-4 text-md-center text-sm-start mb-sm-3">
            <input
            className='form-control'
              onChange={({ target: { value } }) => {
                setText(value)
              }}
              type="text"
              placeholder="Search here..."
            />
          </div>
        </div>
        <Table firsDataIndex={firsDataIndex} lastDataIndex={lastDataIndex} filter={filtered} useSortableData={useSortableData} />
        <Pagination
          dataPerPage={dataPerPage}
          totalData={filtered.length}
          paginate={paginate}
        />
      </div>)
  );
}

export default App;
