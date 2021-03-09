import React, { useEffect } from 'react'
import './App.css'
import HomeScreen from './screens/HomeScreen'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import { auth } from './firebase'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import ProfileScreen from './screens/ProfileScreen'
import initializeUser from './utils'

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      initializeUser(userAuth, dispatch)
    })
    return () => {
      unsubscribe()
    }
  }, [])

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
