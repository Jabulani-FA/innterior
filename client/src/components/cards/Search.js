import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

const Search = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { search } = useSelector((state) => ({ ...state}))
    const { text } = search
    
    const handleChange = (event) => {
        dispatch({ type: 'SEARCH_QUERY', payload: { text: event.target.value } })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        navigate(`/shop?${text}`)
    }

    return (
        <form className="search-form" onSubmit={handleSubmit} role="search">
            <input
                onChange={handleChange}
                type="search"
                value={text}
                className="search-input"
                placeholder="Search pieces"
                aria-label="Search products"
            />
            <button className="search-submit" type="submit" aria-label="Submit search">
                <SearchOutlined />
            </button>
        </form>
    )
}

export default Search