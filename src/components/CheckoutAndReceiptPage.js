import React, { useState, useRef } from 'react';
import { ShoppingCart, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../api';

const CheckoutAndReceiptPage = () => {
    const location = useLocation();
    const { cartItems = [], total = 0, profit = 0 } = location.state || {};

    const [saleCompleted, setSaleCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [purchaseDateTime, setPurchaseDateTime] = useState(null);
    const receiptRef = useRef(null);

    const handleCompleteSale = () => {
        const saleData = cartItems.map(item => ({
            product_id: item.id,
            quantity_sold: item.quantity,
            total_price: item.price * item.quantity,
            profit: (item.price - item.costPrice) * item.quantity
          }));
        
          api.post('/sales', { items: saleData })
            .then((response) => {
              console.log('Sale completed:', response.data);
              setSaleCompleted(true);
              setPurchaseDateTime(new Date().toLocaleString());
            })
            .catch((error) => {
              console.error('Error completing sale:', error);
              setError('Error completing sale. Please try again.');
            });
    };

    const handlePrintReceipt = () => {
      const printContent = receiptRef.current;
      const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      windowPrint.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .receipt { padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      windowPrint.close();
    };

    const handleSavePDF = () => {
        const doc = new jsPDF();
        doc.text('Your Company Name', 105, 15, { align: 'center' });
        doc.text(`Date: ${purchaseDateTime}`, 105, 25, { align: 'center' });

        const tableData = cartItems.map(item => [
          item.name,
          item.quantity,
          `$${item.price.toFixed(2)}`,
          `$${(item.price * item.quantity).toFixed(2)}`
        ]);

        doc.autoTable({
          head: [['Item', 'Quantity', 'Price', 'Total']],
          body: tableData,
          startY: 35,
        });
        const finalY = doc.lastAutoTable.finalY || 35;
        doc.text(`Total: $${total.toFixed(2)}`, 14, finalY + 10);
        doc.text('Thank you for your purchase!', 105, finalY + 25, { align: 'center' });

        doc.save('receipt.pdf');
      };

    if (saleCompleted) {
      return (
        <div className="p-4 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={receiptRef}>
                <div className="header">
                  <h2 className="text-xl font-bold">Your Company Name</h2>
                  <p className="text-sm text-gray-500">Date: {purchaseDateTime}</p>
                </div>
                <div className="items">
                  <h3 className="font-bold mt-4 mb-2">Items Purchased:</h3>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="total">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="footer">
                  Thank you for your purchase! We appreciate your business.
                </p>
              </div>
              <Button onClick={handlePrintReceipt} className="w-full mt-4">
                <Printer className="mr-2" />
                Print Receipt
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2" />
              Review Your Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleCompleteSale} className="w-full mt-4" disabled={cartItems.length === 0}>
          Complete Sale
        </Button>
        {saleCompleted && (
        <div className="mt-4">
          <Button onClick={handlePrintReceipt} className="w-full mb-2">
            <Printer className="mr-2" />
            Print Receipt
          </Button>
          <Button onClick={handleSavePDF} className="w-full">
            Save as PDF
          </Button>
        </div>
      )}
      </div>
    );
  };

  export default CheckoutAndReceiptPage;
