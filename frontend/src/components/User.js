import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../store/auth';

export default function User() {
  const { state } = useAuth();
  const { contract } = state;
  const scannerRef = useRef();
  const [res, setRes] = useState("");
  // const [Result, setResult] = useState({
  //   prd_id: null,
  //   prd_name: null,
  //   batch_no: null,
  //   expirationDate: null,
  //   manufacturingDate: null
  // });

  useEffect(async () => {
    const onScanSuccess = async (decodedText, decodedResult) => {
      setRes(decodedText);
    };
    const scannerId = 'qrScanner';
    scannerRef.current.id = scannerId;

    const htmlScanner = new Html5QrcodeScanner(scannerId, { fps: 10, qrbos: 250 });
    htmlScanner.render(onScanSuccess);

    return () => {
      htmlScanner.clear();
    };
  }, []);

  const isFake = async () => {
    try {
      console.log(res);
      
      const real = await contract.isReal(res);
      // setResult({
      //   prd_id: productInfo[0],
      //   prd_name: productInfo[1],
      //   batch_no: productInfo[2],
      //   expirationDate: new Date(productInfo.expirationDate * 1000).toLocaleString(),
      //   manufacturingDate: new Date(productInfo.manufacturingDate * 1000).toLocaleString()
      // });

      if (real) {
        alert("Product is Real");
      } else {
        alert("Product is Fake");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };


  return (
    <>
      <Navbar />
      <div className="container">
        <div className="input-group mb-4">
          <input type="text" className="form-control" placeholder="Enter Product ID" aria-label="Recipient's username" aria-describedby="basic-addon2" value={res} onChange={(e) => setRes(e.target.value)} />
          <span className="input-group-text btn btn-outline-primary ms-2 fw-semibold" id="basic-addon2" onClick={isFake}>Detect</span>
        </div>
        <h4 className='text-center'>OR</h4>
        <div style={{ width: '400px', marginInline: "auto" }} ref={scannerRef}></div>
        <div className='mt-5'>
         
         {/* {res?<>
          <ul class="list-group">
            <li class="list-group-item text-center"> {Result.prd_id}</li>
            <li class="list-group-item text-center">{Result.prd_name}</li>
            <li class="list-group-item text-center">{Result.batch_no}</li>
            <li class="list-group-item text-center">{Result.expirationDate}</li>
            <li class="list-group-item text-center">{Result.manufacturingDate}</li>
          </ul>
         </> : ""} */}
        </div>
      </div>

      <style>
        {`
          .container {
            height: 300px; 
            width: 600px; 
          }
        `}
      </style>
    </>
  );
}
