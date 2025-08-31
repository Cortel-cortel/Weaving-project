import React from 'react';
import { GiShoppingCart } from "react-icons/gi";
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { IoBagHandle } from "react-icons/io5";

export default function Header() {
    return (
        <div className="header">
            <div className="title">
            <IoBagHandle className='bag-icon' />
                <h4>Light's Shop</h4>

                <Link to="/cart"> 
                    <GiShoppingCart className="cart-icon" />
                </Link>
            </div>
        </div>
    );
}
