import { loadStripe } from "@stripe/stripe-js"
import { login, logout } from "./features/userSlice"
import db from "./firebase"

export const loadCheckout = async (user, priceId) => {
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

const initializeUser = (userAuth, dispatch) => {
  if (userAuth) {
    db.collection('customers')
      .doc(userAuth.uid)
      .collection('subscriptions')
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(async subscription => {
            dispatch(login({
              uid: userAuth.uid,
              email: userAuth.email,
              role: subscription.data().role,
              current_period_end: subscription.data().current_period_end.seconds,
              current_period_start: subscription.data().current_period_start.seconds,
            }))
          })
        } else {
          dispatch(login({
            uid: userAuth.uid,
            email: userAuth.email,
            role: null,
          }))
        }
      })
  } else {
    dispatch(logout())
  }
}

export const initializeProducts = (setProducts) => {
  db.collection("products")
    .where("active", "==", true)
    .get()
    .then(querySnapshot => {
      const products = {}
      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data()
        const priceSnap = await productDoc.ref.collection("prices").get()
        priceSnap.docs.forEach(price => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data()
          }
        })
      })
      setProducts(products)
    })
}

export default initializeUser