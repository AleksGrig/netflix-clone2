import React, { useEffect } from 'react'
import './App.css'
import HomeScreen from './screens/HomeScreen'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import db, { auth } from './firebase'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, selectUser } from './features/userSlice'
import ProfileScreen from './screens/ProfileScreen'

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
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
    })
    return () => {
      unsubscribe()
    }
  }, [dispatch])

  console.log(user)

  return (
    <div className="app">
      <Router>
        {!user ? <LoginScreen /> :
          <Switch>
            <Route path="/profile">
              <ProfileScreen />
            </Route>
            <Route exact path="/">
              {user.role ? <HomeScreen /> : <ProfileScreen />}
            </Route>
          </Switch>
        }
      </Router>
    </div>
  );
}

export default App;
