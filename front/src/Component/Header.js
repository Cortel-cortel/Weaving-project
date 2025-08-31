import React from 'react';
import { GiShoppingCart } from "react-icons/gi";
import { Link } from 'react-router-dom';  
import { IoBagHandle } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";


export default function Header({ user }) {
    const userMode = user;

    return (
        <div className="header">
            <div className="title">
                <h4>See Products</h4>
            </div>
        </div>
    );
}
