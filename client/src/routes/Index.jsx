import React from 'react'
import {BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/home'
import Cart from '../pages/Cart'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Error from '../pages/Error'
import Navbar from '../layouts/Navbar'
const Index = () => {
  return (
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
        </Routes>
        </BrowserRouter>
  )/*
  return (
        <BrowserRouter>
        { <Navbar/>}
        <Routes>
            <Route path='/' element={<Home/>}/>
            {/* <Route path='/register' element={<Register/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/*' element={<Error/>}/>}
        </Routes>
        </BrowserRouter>
  )
  */
}

export default Index;
