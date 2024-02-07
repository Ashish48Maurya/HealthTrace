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


  let mongores;
  async function fetchData(id) {
    try {
      const response = await fetch(`http://localhost:8000/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Data: ",data.ans[0].productID)
        mongores = data.ans[0].productID;
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  const isFake = async () => {
    try {
      await fetchData(res);
      const prd = await contract.products(res);
      // console.log("PRD:",prd);
      // console.log("PRD2:",mongores);
      if(prd===mongores){
        alert("Real")
      }
      else{
        alert("fake");
      }
      // const real = await contract.isReal(res);

      // setResult({
      //   prd_id: productInfo[0],
      //   prd_name: productInfo[1],
      //   batch_no: productInfo[2],
      //   expirationDate: new Date(productInfo.expirationDate * 1000).toLocaleString(),
      //   manufacturingDate: new Date(productInfo.manufacturingDate * 1000).toLocaleString()
      // });
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
