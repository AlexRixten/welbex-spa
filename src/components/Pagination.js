import React from 'react'

export const Pagination = ({ dataPerPage, totalData, paginate}) => {
    const pageNumbers = []

    for(let i = 1; i <= Math.ceil(totalData/dataPerPage); i++){
        pageNumbers.push(i)
    }
  return (
    <div className='container mt-5'>
        <ul className="pagination">
            {
                pageNumbers.map(number => (
                    <li className="page-item" key={number}>
                        <a href="#" className="page-link" onClick={() => paginate(number)}>{number}</a>
                    </li>
                ))
            }
        </ul>
    </div>
  )
}
