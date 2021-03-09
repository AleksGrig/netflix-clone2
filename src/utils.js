import { login, logout } from "./features/userSlice"
import db from "./firebase"

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