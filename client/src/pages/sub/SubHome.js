import React, { useEffect, useState } from 'react'
import { getSub } from '../../functions/sub'
import ProductCard from '../../components/cards/ProductCard'
import { useParams } from 'react-router-dom'

const SubHome = () => {
    const { slug } = useParams()
    const [sub, setsub] = useState([])
    const [products, setproducts] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setloading(true)
        getSub(slug).then((res) => {
            setsub(res.data.sub)
            setproducts(res.data.products)
            setloading(false)
        })
    }, [slug])
    
  return (
    <div className='container'>
        <div className='row'>
            <div className='col'>
                {loading ? (
                    <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>Loading...</h4>
                ):(
                    <h4 className='text-center p-3 mt-5 mb-5 display-5 jumbotron'>{products.length} Products in "{sub.name}" Sub Category</h4>
                )}
            </div>
        </div>
        <div className='row'>
            {products.map((p) => (
                <div className='col' key={p._id}>
                    <ProductCard product={p}/>
                </div>     
            ))}
        </div>
    </div>
  )
}

export default SubHome