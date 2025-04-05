import React from 'react'

// const person={
//     firstName: 'John',
//     lastName: 'Doe',
//     address: 'John Doe',
//     email: 'john@doe.com',
// }
// person.firstName
// //Destructing firstname lastname from the person
// const { firstName, lastName, address, email, phone } = person;
// console.log(firstName, lastName, address, email, phone);

const Search = ({searchTerm,setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="Search" />
                <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}
export default Search
