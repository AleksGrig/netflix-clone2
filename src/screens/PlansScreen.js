import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import db from '../firebase'
import './PlansScreen.css'
import { loadStripe } from '@stripe/stripe-js'
import { initializeProducts, loadCheckout } from '../utils'

function PlansScreen() {
  const [products, setProducts] = useState([])
  const user = useSelector(selectUser)

  useEffect(() => {
    initializeProducts(setProducts)
  }, [])

  return (
    <div className="plansScreen">
      {user.role && (
        <p className="plansScreen__renewal">
          Renewal Date: {new Date(user.current_period_end * 1000).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        // TODO: add some check if the user's subscription is active
        const isCurrentPackage = productData.name?.toLowerCase()
          .includes(user?.role)
        return (
          <div
            key={productId}
            className={`${isCurrentPackage && 'plansScreen__plan--disabled'} plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick={() => !isCurrentPackage && loadCheckout(user, productData.prices.priceId)}>
              {isCurrentPackage ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlansScreen
