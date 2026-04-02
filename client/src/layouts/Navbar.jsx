import React from 'react'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav>
      <NavLink to="/" className='nav_link'>Home</NavLink>
      <NavLink to="/register" className='nav_link'>Register</NavLink>
      <NavLink to="/login" className='nav_link'>Login</NavLink>
      <NavLink to="/cart" className='nav_link'>Cart</NavLink>
      </nav>
  )
}

export default Navbar
