import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./OrderActionWindow.css";

const OrderActionWindow = ({ uid, mode }) => {
  const { closeOrderWindow } = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const handleOrderClick = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"}/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: mode,
      });

      alert(response.data || "Order placed successfully!");
      closeOrderWindow();
      // Optional: Refresh the page to show updated balances
      window.location.reload(); 
    } catch (error) {
      const errorMsg = error.response?.data || "Failed to place order. Please try again.";
      alert("Trade Error: " + errorMsg);
      // Don't close window on error so user can correct qty/price
    }
  };

  const handleCancelClick = () => {
    closeOrderWindow();
  };

  const isBuy = mode === "BUY";

  return (
    <div className={`container order-window ${isBuy ? 'buy' : 'sell'}`} id="order-window" draggable="true">
      <div className="regular-order">
        <h4 className="order-title">{isBuy ? 'Buy' : 'Sell'} {uid}</h4>
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice * 0.2).toFixed(2)}</span>
        <div>
          <button className={`btn ${isBuy ? 'btn-blue' : 'btn-red'}`} onClick={handleOrderClick}>
             {isBuy ? 'Buy' : 'Sell'}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderActionWindow;
