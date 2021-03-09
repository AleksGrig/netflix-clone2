import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import db from '../firebase'
import './PlansScreen.css'
import { loadStripe } from '@stripe/stripe-js'
import { initializeProducts } from '../utils'

function PlansScreen() {
  const [products, setProducts] = useState([])
  const user = useSelector(selectUser)

  useEffect(() => {
    initializeProducts(setProducts)
  }, [])

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection('customers')
      .doc(user.uid)
      .collection('checkout_sessions')
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      })
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data()
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`)
      }
      if (sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe('pk_test_51IPOLYJQGixIR89grGM5edCuiONbJWGLiI7KGTRVErJVhLdM3QchjEACY6CUqbbqGTkE1R3fGzyHxLoKJE6pRx9r00lbSbOSIM')
        stripe.redirectToCheckout({ sessionId })
      }
    })
  }

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

            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
              {isCurrentPackage ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlansScreen
