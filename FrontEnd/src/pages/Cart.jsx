import React, { useState,useEffect } from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Appbar from "../components/mui/Appbar";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Cart({ cartItems,  onRemove }) {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState(false);
  const [items, setItems] = useState(cartItems);
  const navigates = useNavigate();

  const calculateTotalCost = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return items.length;
  };
  
  const createOrder = (data, action) => {
    return action.order
      .create({
        purchase_units: [
          {
            description: "art",
            amount: {
              currency_code: "USD",
              value: calculateTotalCost(),
            },
          },
        ],
        application_context: {
          shipping_prefernce: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        setOrderId(orderID);
        return orderID;
      });
  };


  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async function (details) {
      const { payer } = details;
      setSuccess(true);
  
      try {
        const token = localStorage.getItem("x-auth-token");
        if (!token) throw new Error("Token not found");
        const decodedToken = jwtDecode(token);
        const buyerId = decodedToken.id;
  
        const payload = items.map((item) => ({
          buyerId,
          sellerId: item.seller._id,
          productId: item._id,
        }));
  
        const response = await fetch("http://localhost:5000/api/purchases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          const result = await response.json();
          toast.success("Order placed successfully!");
  
          const purchasedProductIds = payload.map((item) => item.productId);
          const updatedItems = items.filter(
            (item) => !purchasedProductIds.includes(item._id)
          );
  
          setItems(updatedItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedItems));  
          navigates("/");
          window.location.reload();
        } else {
          toast.error("Failed to place the order. Please try again.");
        }
      } catch (error) {
        console.error("Error in order API call:", error);
        toast.error("Something went wrong with the order API.");
      }
    });
  };
  

  const onError = (data, actions) => {
    setErrorMessage("An Error Accured");
    navigates("/cart");
  };
  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  return (
    <Container>
      <Appbar cartItemCount={getCartItemCount()} navbarBackground={"white"} />

      <PayPalScriptProvider
        options={{
          "client-id":
            "AQ1Hp2ZYf_kBZ0NKBmsBnSSPKa3NXCSqpL7MgfamJbs7zuCcJ4aQ5KpYzdRzlpECdZBKnUcs0vQL4Dt-",
        }}
      >
        <TableContainer component={Paper} style={{ marginTop: "10rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Produt Image</TableCell>
                <TableCell>Produt Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) =>
                item.quantity > 0 ? (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        style={{ height: "50px" }}
                        alt=""
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => onRemove(item)}
                        sx={{ minWidth: "0", padding: "4px" }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : null,
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              marginTop: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{ color: "black", borderColor: "black", marginLeft: "2px" }}
              onClick={() => setShow(true)}
              type="submit"
            >
              Checkout ${calculateTotalCost()}{" "}
            </Button>
          </Box>
        </TableContainer>
        <br />
        {show ? (
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        ) : null}
      </PayPalScriptProvider>
    </Container>
  );
}