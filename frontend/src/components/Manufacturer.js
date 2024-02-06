import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { v4 as uuidv4 } from 'uuid';
import qrCode from 'qrcode';
import { useAuth } from '../store/auth';

export default function Manufacturer() {
  const { state } = useAuth();
  const { contract } = state;
  const [manufactureDate, setManufactureDate] = useState("");
  const [productID, setProductID] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [prdName, setPrdName] = useState("");
  const [qrcode, setQRCode] = useState("https://google.com");
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    const initializeProductData = async () => {
      setProductID(generateUniqueID());
      setManufactureDate(getCurrentDate());
      // await generateQRCode();
    };

    initializeProductData();
  }, []);

  const generateUniqueID = () => {
    return uuidv4();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  // const generateQRCode = async () => {
  //   const url = await qrCode.toDataURL(`http://localhost:${productID}`);
  //   setQRCode(url);
  //   console.log(url);
  // };



  const addProduct = async (e) => {
    e.preventDefault();
    // if (qrCode) {
      try {
        const ans = await fetch("http://localhost:8000/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productID, prdName, batchNo, qrcode, manufactureDate, expirationDate
          })
        })
        if (ans.ok) {
          // const data = await ans.json();
          // console.log("Response:", data);
          const transaction = await contract.uploadProduct(productID);
        await transaction.wait();
          alert("Product Added Successfully");
        } else {
          console.error('Error:', ans.statusText);
        }

        setProductID(generateUniqueID());
        setBatchNo("");
        setPrdName("");
        setExpirationDate("");
      } catch (error) {
        console.error("Error while adding product:", error);
        alert("Server Busy, Try Again Later");
      }
    // } 
    // else {
    //   alert("QR Code not Generated yet");
    // }
  };

  return (
    <>
      <Navbar />
      <div className="container col-lg-6 col-md-8 col-sm-10">
        <form onSubmit={addProduct}>
          <div className="mb-3">
            <label htmlFor="product_id" className="form-label">Product ID:</label>
            <input type="text" id="product_id" name="product_id" className="form-control" required value={productID} readOnly />
          </div>

          <div className="mb-3">
            <label htmlFor="product_name" className="form-label">Product Name:</label>
            <input type="text" id="product_name" name="product_name" className="form-control" required value={prdName} onChange={(e) => setPrdName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="batch_no" className="form-label">Batch Number:</label>
            <input type="text" id="batch_no" name="batch_no" className="form-control" required value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
          </div>

          {/* {qrcode && (
            <div className='mb-3'>
              <label htmlFor='qrcode' className="form-label">QR Code:</label>
              <div className='text-center'>
                <img src={qrcode} alt="" className="img-fluid" />
              </div>
            </div>
          )} */}

          <div className="mb-3">
            <label htmlFor="manufacture_date" className="form-label">Manufacture Date:</label>
            <input type="date" id="manufacture_date" name="manufacture_date" className="form-control" required value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="expiration_date" className="form-label">Expiration Date:</label>
            <input type="date" id="expiration_date" name="expiration_date" className="form-control" required value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
          </div>

          <button type="submit" className='btn btn-primary'>Submit</button>
        </form>
      </div>
    </>
  );
}
