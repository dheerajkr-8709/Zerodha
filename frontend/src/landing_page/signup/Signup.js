import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Signup() {
  // Navigation / Stepper State
  const [step, setStep] = useState(1);
  const stepsList = [
    "Mobile",
    "Email",
    "PAN Details",
    "DigiLocker",
    "Bank Details",
    "IPV (Liveness)",
    "E-Sign",
    "Credentials"
  ];

  // Form Fields State
  const [mobile, setMobile] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [sentMobileOtp, setSentMobileOtp] = useState("");
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);

  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [sentEmailOtp, setSentEmailOtp] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);

  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");

  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [sentAadhaarOtp, setSentAadhaarOtp] = useState("");
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);
  const [isDigiLockerLinked, setIsDigiLockerLinked] = useState(false);

  const [bankAccount, setBankAccount] = useState("");
  const [confirmBankAccount, setConfirmBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [occupation, setOccupation] = useState("Professional");
  const [income, setIncome] = useState("5-10L");
  const [riskProfile, setRiskProfile] = useState("Moderate");

  // IPV (In-Person Verification) State
  const [ipvCode, setIpvCode] = useState("");
  const [ipvPhoto, setIpvPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // E-Sign State
  const [eSignAadhaar, setESignAadhaar] = useState("");
  const [eSignOtp, setESignOtp] = useState("");
  const [sentESignOtp, setSentESignOtp] = useState("");
  const [isESignOtpSent, setIsESignOtpSent] = useState(false);
  const [isESigned, setIsESigned] = useState(false);

  // Credentials & Final Submit
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate random 4-digit IPV code on mount
  useEffect(() => {
    setIpvCode(Math.floor(1000 + Math.random() * 9000).toString());
  }, []);

  // IPV Camera setup
  useEffect(() => {
    if (step === 6 && isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 220 } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.warn("Webcam access not available or denied: Using canvas mockup.", err);
        });
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step, isCameraActive]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Helper: Generates random OTP
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Handlers for step navigation
  const handleSendMobileOtp = () => {
    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    const otp = generateOtp();
    setSentMobileOtp(otp);
    setIsMobileOtpSent(true);
    alert(`[MOCK SMS SERVICE] Your signup OTP verification code is: ${otp}`);
  };

  const handleVerifyMobileOtp = () => {
    if (mobileOtp === sentMobileOtp && mobileOtp !== "") {
      setStep(2);
    } else {
      alert("Invalid Mobile OTP. Please check the mock code sent.");
    }
  };

  const handleSendEmailOtp = () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    const otp = generateOtp();
    setSentEmailOtp(otp);
    setIsEmailOtpSent(true);
    alert(`[MOCK EMAIL SERVICE] Your email verification code is: ${otp}`);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtp === sentEmailOtp && emailOtp !== "") {
      setStep(3);
    } else {
      alert("Invalid Email OTP.");
    }
  };

  const handleVerifyPan = () => {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
      alert("Please enter a valid PAN number format (e.g. ABCDE1234F).");
      return;
    }
    if (!dob) {
      alert("Please enter your date of birth.");
      return;
    }
    setStep(4);
  };

  const handleSendAadhaarOtp = () => {
    if (!/^\d{12}$/.test(aadhaar)) {
      alert("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    const otp = generateOtp();
    setSentAadhaarOtp(otp);
    setIsAadhaarOtpSent(true);
    alert(`[DIGILOCKER / UIDAI] OTP sent to Aadhaar-linked mobile: ${otp}`);
  };

  const handleVerifyAadhaarOtp = () => {
    if (aadhaarOtp === sentAadhaarOtp && aadhaarOtp !== "") {
      setIsDigiLockerLinked(true);
      alert("DigiLocker KYC details fetched successfully from KRA!");
      setStep(5);
    } else {
      alert("Invalid Aadhaar OTP.");
    }
  };

  const handleSaveBank = () => {
    if (!bankAccount || bankAccount !== confirmBankAccount) {
      alert("Bank accounts do not match or are empty.");
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
      alert("Please enter a valid 11-digit IFSC code (e.g. SBIN0001234).");
      return;
    }
    setStep(6);
    setIsCameraActive(true);
  };

  const handleCaptureIpv = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (video && video.srcObject) {
        ctx.drawImage(video, 0, 0, 300, 220);
      } else {
        // Fallback drawing if camera not available
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, 300, 220);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        ctx.fillText("Simulated IPV Capture", 60, 90);
      }
      // Draw OTP code overlay on image
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 180, 300, 40);
      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`CODE: ${ipvCode}`, 20, 208);
      ctx.fillStyle = "#10b981";
      ctx.fillText(`VERIFIED`, 180, 208);

      const dataUrl = canvas.toDataURL("image/png");
      setIpvPhoto(dataUrl);
      stopCamera();
      setIsCameraActive(false);
      alert("Liveness photo captured successfully with placard verification!");
    }
  };

  const handleProceedToESign = () => {
    if (!ipvPhoto) {
      alert("Please capture your IPV photo first.");
      return;
    }
    setStep(7);
  };

  const handleSendESignOtp = () => {
    if (!/^\d{12}$/.test(eSignAadhaar)) {
      alert("Please enter your 12-digit Aadhaar number for digital signing.");
      return;
    }
    const otp = generateOtp();
    setSentESignOtp(otp);
    setIsESignOtpSent(true);
    alert(`[NSDL E-SIGN] Aadhaar OTP sent to your registered mobile: ${otp}`);
  };

  const handleVerifyESignOtp = () => {
    if (eSignOtp === sentESignOtp && eSignOtp !== "") {
      setIsESigned(true);
      alert("Application E-signed successfully via NSDL Electronic Signature service!");
      setStep(8);
    } else {
      alert("Invalid E-Sign OTP.");
    }
  };

  const handleFinalSignup = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please choose a username and password.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        email,
        username,
        password,
        riskProfile,
        mobile,
        pan: pan.toUpperCase(),
        dob,
        bankAccount,
        ifsc: ifsc.toUpperCase(),
        aadhaar,
        ipvVerified: true,
        eSignCompleted: true
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || "https://zerodha-backend-117g.onrender.com"}/signup`, 
        payload
      );

      setIsLoading(false);
      if (data.success) {
        alert("Congratulations! Your Zerodha-style account is active and verified.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      setIsLoading(false);
      alert(error.response?.data?.message || "Signup submission failed.");
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ minHeight: "80vh" }}>
      {/* Visual Stepper */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between position-relative align-items-center" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="position-absolute w-100 bg-light-subtle" style={{ height: "4px", zIndex: 1, backgroundColor: "#e2e8f0", top: "50%", transform: "translateY(-50%)" }}>
              <div 
                className="bg-primary transition-all" 
                style={{ 
                  height: "400%", 
                  width: `${((step - 1) / (stepsList.length - 1)) * 100}%`, 
                  backgroundColor: "#38bdf8", 
                  transition: "width 0.4s ease" 
                }}
              />
            </div>
            {stepsList.map((label, idx) => (
              <div key={label} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold`} 
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    backgroundColor: step > idx + 1 ? "#10b981" : step === idx + 1 ? "#3b82f6" : "#cbd5e1",
                    transition: "background-color 0.3s ease"
                  }}
                >
                  {step > idx + 1 ? "✓" : idx + 1}
                </div>
                <span className="mt-2 text-muted fw-semibold d-none d-md-inline" style={{ fontSize: "0.75rem" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stepper Card Content */}
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-10">
          <div className="card border-0 shadow-lg p-5" style={{ borderRadius: "16px", backgroundColor: "#ffffff" }}>
            
            {/* STEP 1: MOBILE VERIFICATION */}
            {step === 1 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>Signup with Mobile</h2>
                <p className="text-muted mb-4">Start your digital application by verifying your 10-digit mobile number.</p>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">MOBILE NUMBER</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 fw-semibold">+91</span>
                    <input 
                      type="text" 
                      maxLength="10"
                      className="form-control form-control-lg border-start-0 ps-1 fs-5"
                      placeholder="Enter mobile number" 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                {isMobileOtpSent && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted small">ENTER 6-DIGIT OTP</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      className="form-control form-control-lg text-center letter-spacing-lg fs-4" 
                      placeholder="• • • • • •"
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  {!isMobileOtpSent ? (
                    <button 
                      type="button" 
                      className="btn btn-primary py-3 fs-5" 
                      style={{ backgroundColor: "#3b82f6", border: "none" }}
                      onClick={handleSendMobileOtp}
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-success py-3 fs-5" 
                      onClick={handleVerifyMobileOtp}
                    >
                      Verify OTP & Continue
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: EMAIL VERIFICATION */}
            {step === 2 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>Verify Email Address</h2>
                <p className="text-muted mb-4">An OTP will be sent to your email to verify authenticity.</p>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg fs-5" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {isEmailOtpSent && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted small">ENTER EMAIL OTP</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      className="form-control form-control-lg text-center letter-spacing-lg fs-4" 
                      placeholder="• • • • • •"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  {!isEmailOtpSent ? (
                    <button 
                      type="button" 
                      className="btn btn-primary py-3 fs-5" 
                      style={{ backgroundColor: "#3b82f6", border: "none" }}
                      onClick={handleSendEmailOtp}
                    >
                      Get OTP Code
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-success py-3 fs-5" 
                      onClick={handleVerifyEmailOtp}
                    >
                      Verify & Continue
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: PAN DETAILS */}
            {step === 3 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>PAN Card Verification</h2>
                <p className="text-muted mb-4">Please input your Permanent Account Number (PAN) and Date of Birth as per Govt records.</p>
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">PAN CARD NUMBER</label>
                  <input 
                    type="text" 
                    maxLength="10"
                    className="form-control form-control-lg text-uppercase fs-5" 
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">DATE OF BIRTH</label>
                  <input 
                    type="date" 
                    className="form-control form-control-lg fs-5" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="d-grid mt-4">
                  <button 
                    type="button" 
                    className="btn btn-primary py-3 fs-5" 
                    style={{ backgroundColor: "#3b82f6", border: "none" }}
                    onClick={handleVerifyPan}
                  >
                    Validate PAN
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DIGILOCKER / AADHAAR */}
            {step === 4 && (
              <div>
                <div className="d-flex align-items-center mb-3">
                  <img src="https://www.digilocker.gov.in/assets/img/logo.svg" alt="DigiLocker" style={{ height: "40px", marginRight: "12px" }} />
                  <h2 className="fw-bold m-0" style={{ color: "#1e3a8a" }}>DigiLocker KYC Link</h2>
                </div>
                <p className="text-muted mb-4">Connect securely to DigiLocker to fetch Aadhaar address credentials.</p>
                
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">12-DIGIT AADHAAR NUMBER</label>
                  <input 
                    type="text" 
                    maxLength="12"
                    className="form-control form-control-lg text-center fs-5" 
                    placeholder="0000 0000 0000"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                {isAadhaarOtpSent && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted small">ENTER UIDAI OTP</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      className="form-control form-control-lg text-center letter-spacing-lg fs-4" 
                      placeholder="• • • • • •"
                      value={aadhaarOtp}
                      onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  {!isAadhaarOtpSent ? (
                    <button 
                      type="button" 
                      className="btn btn-primary py-3 fs-5" 
                      style={{ backgroundColor: "#1e3a8a", border: "none" }}
                      onClick={handleSendAadhaarOtp}
                    >
                      Authenticate Aadhaar
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-success py-3 fs-5" 
                      onClick={handleVerifyAadhaarOtp}
                    >
                      Verify & Import KYC
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: BANK DETAILS & PROFILE */}
            {step === 5 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>Bank & Investment Settings</h2>
                <p className="text-muted mb-4">Add your savings/current account to link with the demat portfolio.</p>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted small">BANK ACCOUNT NUMBER</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg" 
                      placeholder="Account number"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted small">CONFIRM ACCOUNT NUMBER</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      placeholder="Re-enter account number"
                      value={confirmBankAccount}
                      onChange={(e) => setConfirmBankAccount(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">IFSC CODE</label>
                  <input 
                    type="text" 
                    maxLength="11"
                    className="form-control form-control-lg text-uppercase" 
                    placeholder="SBIN0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted small">ANNUAL INCOME</label>
                    <select className="form-select form-select-lg" value={income} onChange={(e) => setIncome(e.target.value)}>
                      <option value="1-5L">₹1,00,000 - ₹5,00,000</option>
                      <option value="5-10L">₹5,00,000 - ₹10,00,000</option>
                      <option value="10-25L">₹10,00,000 - ₹25,00,000</option>
                      <option value="25L+">₹25,00,000+</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted small">OCCUPATION</label>
                    <select className="form-select form-select-lg" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                      <option value="Professional">Professional</option>
                      <option value="Salaried">Salaried</option>
                      <option value="Business">Business</option>
                      <option value="Retired">Retired</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">RISK TOLERANCE PROFILE</label>
                  <select className="form-select form-select-lg" value={riskProfile} onChange={(e) => setRiskProfile(e.target.value)}>
                    <option value="Conservative">Conservative (Low volatility, Capital preservation)</option>
                    <option value="Moderate">Moderate (Balanced, Core market indexing)</option>
                    <option value="Aggressive">Aggressive (High growth, Tech & momentum equities)</option>
                  </select>
                </div>

                <div className="d-grid mt-4">
                  <button 
                    type="button" 
                    className="btn btn-primary py-3 fs-5" 
                    style={{ backgroundColor: "#3b82f6", border: "none" }}
                    onClick={handleSaveBank}
                  >
                    Confirm Bank Details
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: IPV (Liveness Check) */}
            {step === 6 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>In-Person Verification (IPV)</h2>
                <p className="text-muted mb-4">Please hold up a placard or piece of paper with the numeric code shown below in front of your camera.</p>
                
                <div className="text-center bg-danger-subtle p-3 rounded mb-4">
                  <span className="text-muted d-block small fw-bold">YOUR VERIFICATION CODE</span>
                  <span className="display-4 fw-bold text-danger">{ipvCode}</span>
                </div>

                <div className="d-flex justify-content-center bg-dark rounded p-2 mb-4 position-relative" style={{ height: "230px" }}>
                  {ipvPhoto ? (
                    <img src={ipvPhoto} alt="Captured IPV" className="rounded" style={{ width: "300px", height: "220px", objectFit: "cover" }} />
                  ) : (
                    <>
                      <video ref={videoRef} className="rounded bg-secondary" style={{ width: "300px", height: "220px", objectFit: "cover" }}></video>
                      <canvas ref={canvasRef} width="300" height="220" className="d-none"></canvas>
                      {!isCameraActive && (
                        <div className="position-absolute start-50 top-50 translate-middle text-center text-white">
                          <p className="small">Camera inactive. Click to initialize simulator.</p>
                          <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setIsCameraActive(true)}>Start Stream</button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="d-grid gap-2">
                  {!ipvPhoto ? (
                    <button 
                      type="button" 
                      className="btn btn-danger py-3 fs-5" 
                      onClick={handleCaptureIpv}
                    >
                      Capture Photo
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary py-3 flex-fill" 
                        onClick={() => { setIpvPhoto(null); setIsCameraActive(true); }}
                      >
                        Recapture
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary py-3 flex-fill" 
                        style={{ backgroundColor: "#3b82f6", border: "none" }}
                        onClick={handleProceedToESign}
                      >
                        Continue to E-Sign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: E-SIGN VIA AADHAAR */}
            {step === 7 && (
              <div>
                <div className="d-flex align-items-center mb-3">
                  <h2 className="fw-bold m-0" style={{ color: "#0284c7" }}>NSDL Electronic Signature (eSign)</h2>
                </div>
                <p className="text-muted mb-4">Finalize application submission by signing digital forms with Aadhaar UIDAI signature authority.</p>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">ENTER AADHAAR NUMBER</label>
                  <input 
                    type="text" 
                    maxLength="12"
                    className="form-control form-control-lg text-center fs-5" 
                    placeholder="0000 0000 0000"
                    value={eSignAadhaar}
                    onChange={(e) => setESignAadhaar(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                {isESignOtpSent && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted small">ENTER eSign OTP</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      className="form-control form-control-lg text-center letter-spacing-lg fs-4" 
                      placeholder="• • • • • •"
                      value={eSignOtp}
                      onChange={(e) => setESignOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  {!isESignOtpSent ? (
                    <button 
                      type="button" 
                      className="btn btn-info py-3 fs-5 text-white" 
                      style={{ backgroundColor: "#0284c7", border: "none" }}
                      onClick={handleSendESignOtp}
                    >
                      Authorize eSign
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-success py-3 fs-5" 
                      onClick={handleVerifyESignOtp}
                    >
                      Sign Application Form
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 8: CREDENTIALS CREATION & FINAL SUBMIT */}
            {step === 8 && (
              <div>
                <h2 className="fw-bold mb-3" style={{ color: "#1f2937" }}>Setup ApexVest Credentials</h2>
                <p className="text-muted mb-4">You're almost there! Create a unique username and password to secure your login.</p>
                
                <form onSubmit={handleFinalSignup}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">CHOOSE USERNAME</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      required
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold text-muted small">PASSWORD</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg" 
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-success py-3 fs-5" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting Application..." : "Finish Account Setup"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
