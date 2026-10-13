import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    ArrowRightOutlined,
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingOutlined,
} from '@ant-design/icons'

const currency = (amount) => `₦${Number(amount || 0).toLocaleString()}`

const Cart = () => {
    const cart = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    const subtotal = cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.count || 1), 0)

    const saveCart = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        dispatch({ type: 'ADD_TO_CART', payload: updatedCart })
    }

    const changeQuantity = (itemId, delta) => {
        const updatedCart = cart
            .map((item) => item._id === itemId
                ? { ...item, count: Math.max(1, Number(item.count || 1) + delta) }
                : item)
        saveCart(updatedCart)
    }

    const removeItem = (itemId) => {
        saveCart(cart.filter((item) => item._id !== itemId))
    }

    return (
        <div className="cart-page">
            <header className="cart-page-heading">
                <div>
                    <p className="section-kicker">YOUR SELECTION</p>
                    <h1>Shopping bag</h1>
                    <p>{cart.length} {cart.length === 1 ? 'piece' : 'pieces'} selected</p>
                </div>
                <Link className="cart-continue-link" to="/shop"><ShoppingOutlined /> Continue shopping</Link>
            </header>

            {!cart.length ? (
                <section className="cart-empty-state">
                    <span className="cart-empty-icon"><ShoppingOutlined /></span>
                    <p className="section-kicker">ROOM TO FIND YOUR NEXT FAVOURITE</p>
                    <h2>Your bag is taking a breather.</h2>
                    <p>Browse considered furniture and finishing touches for your home.</p>
                    <Link className="store-button store-button-dark" to="/shop">Explore the collection <ArrowRightOutlined /></Link>
                </section>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items" aria-label="Items in your bag">
                        <div className="cart-list-heading"><span>Piece</span><span>Quantity</span><span>Total</span></div>
                        {cart.map((item) => (
                            <article className="cart-item" key={item._id}>
                                <Link className="cart-item-image" to={`/product-details/${item.slug}`}>
                                    <img src={item.images?.[0]?.url || '/Innterior.png'} alt={item.title || 'Furniture piece'} />
                                </Link>
                                <div className="cart-item-information">
                                    {item.category?.name && <span className="cart-item-category">{item.category.name}</span>}
                                    <Link className="cart-item-title" to={`/product-details/${item.slug}`}>{item.title}</Link>
                                    <span className="cart-item-variant">{item.color || item.brand || 'Home collection'}</span>
                                    <span className="cart-item-unit-price">{currency(item.price)} each</span>
                                    <button className="cart-remove-button" type="button" onClick={() => removeItem(item._id)}>
                                        <DeleteOutlined /> Remove
                                    </button>
                                </div>
                                <div className="cart-quantity-control" aria-label={`Quantity for ${item.title}`}>
                                    <button type="button" onClick={() => changeQuantity(item._id, -1)} aria-label={`Decrease ${item.title} quantity`} disabled={Number(item.count || 1) <= 1}>
                                        <MinusOutlined />
                                    </button>
                                    <span>{item.count || 1}</span>
                                    <button type="button" onClick={() => changeQuantity(item._id, 1)} aria-label={`Increase ${item.title} quantity`}>
                                        <PlusOutlined />
                                    </button>
                                </div>
                                <strong className="cart-item-total">{currency(Number(item.price || 0) * Number(item.count || 1))}</strong>
                            </article>
                        ))}
                        <div className="cart-delivery-note">
                            <span className="cart-delivery-mark">01</span>
                            <p><strong>Delivery is arranged after order confirmation.</strong><br />Final delivery cost and timing depend on your location and will need to be confirmed by the store.</p>
                        </div>
                    </section>

                    <aside className="cart-summary">
                        <p className="section-kicker">ORDER SUMMARY</p>
                        <h2>At a glance</h2>
                        <div className="cart-summary-lines">
                            <div><span>Items subtotal</span><strong>{currency(subtotal)}</strong></div>
                            <div><span>Delivery</span><span>Confirmed after enquiry</span></div>
                        </div>
                        <div className="cart-summary-total"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
                        <p className="cart-summary-note">Taxes and delivery are not included in this subtotal.</p>
                        <Link className="store-button store-button-dark cart-checkout-button" to="/checkout">Review checkout <ArrowRightOutlined /></Link>
                        <Link className="cart-edit-link" to="/shop">Continue browsing</Link>
                    </aside>
                </div>
            )}
        </div>
    )
}

export default Cart