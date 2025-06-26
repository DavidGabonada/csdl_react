import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const generateCaptcha = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const PuzzleAuth = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [isChecked, setIsChecked] = useState(false)
    const [userInput, setUserInput] = useState("");
    const [captchaColors, setCaptchaColors] = useState(Array.from({ length: 5 }, getRandomColor));
    const [showSecurityCheck, setShowSecurityCheck] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState(null);
    const [timestamp, setTimestamp] = useState("");
    const [timeLeft, setTimeLeft] = useState(20); // 2FA countdown timer

    const navigate = useNavigate();

    useEffect(() => {
        if (secureLocalStorage.getItem("adminLogin") === "true") {
            navigate("/MainDashboard");
        }
    }, [navigate]);

    useEffect(() => {
        if (show2FA && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (timeLeft === 0) {
            setShow2FA(false);
            setVerificationCode("");
            toast.error("Time expired! Please retry Captcha.");
        }
    }, [show2FA, timeLeft]);

    const handleEmailChange = (e) => {
        const emailRegex = /^[a-zA-Z.@0-9-]+$/;
        if (emailRegex.test(e.target.value) || e.target.value === "") {
            setUsername(e.target.value);
        }
    };

    const isFormComplete = () => username.trim() !== "" && password.trim() !== "";

    const handleSubmitCaptcha = () => {
        if (userInput === captcha.join("")) {
            toast.success("Captcha Correct!");
            setShow2FA(true);
            sendVerificationCode();
            setTimeLeft(20); // Reset timer when 2FA starts
        } else {
            toast.error("Captcha Incorrect, try again.");
            setCaptcha(generateCaptcha());
            setCaptchaColors(Array.from({ length: 5 }, getRandomColor));
            setUserInput("");
        }
    };

    const sendVerificationCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        const now = new Date();
        setTimestamp(now.toLocaleTimeString() + ":" + now.getSeconds());
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isChecked) {
            toast.error("Please verify security first.");
            return;
        }
        if (verificationCode !== generatedCode) {
            toast.error("Invalid Verification Code. Please try again.");
            return;
        }

        try {
            const url = secureLocalStorage.getItem("url") + "user.php";
            const jsonData = { username: username, password: password };
            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "adminLogin");

            const res = await axios.post(url, formData);
            console.log("Login response:", res.data);
            if (res.data === 0) {
                toast.error("Invalid Credentials");
                setUsername("");
                setPassword("");
            } else {
                toast.success("Login successful!");
                secureLocalStorage.setItem("userId", res.data.adm_id);
                secureLocalStorage.setItem("userImage", res.data.adm_image_filename);
                secureLocalStorage.setItem("adminLogin", "true");
                secureLocalStorage.setItem("adminLevel", res.data.adm_user_level);
                secureLocalStorage.setItem("adminName", res.data.adm_name);

                navigate("/MainDashboard");
            }
        } catch (error) {
            toast.error("Login failed. Please try again later.");
            console.error("Login error:", error);
        }
    };

    return (
        <div
            className="flex flex-col md:flex-row min-h-screen items-center justify-center px-4"
            style={{
                backgroundImage: 'url("images/background.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Left Section (Text Content) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-green-900 p-12 text-center">
                <h1 className="text-9xl font-semibold">HK SMS</h1>
                <p className="mt-4 text-lg">HK Scholars Management System</p>
            </div>

            {/* Right Section (Login Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-3xl font-semibold text-green-900 text-center mb-6">Sign in</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleEmailChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                    />
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="mr-2"
                        />
                        <label className="text-sm">Verify Security</label>
                    </div>
                    {isChecked && (
                        <div className="mt-4 bg-gray-100 p-5 rounded-lg text-center">
                            <h3 className="text-xl font-semibold mb-3">Captcha Verification</h3>
                            <div className="mb-4 text-2xl">
                                {captcha.map((num, index) => (
                                    <span key={index} style={{ color: captchaColors[index], margin: "0 5px" }}>
                                        {num}
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Captcha"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-md"
                            />
                            <button
                                onClick={handleSubmitCaptcha}
                                className="w-full mt-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                            >
                                Submit Captcha
                            </button>
                        </div>
                    )}

                    {show2FA && (
                        <div className="mt-4 bg-gray-100 p-5 rounded-lg text-center">
                            <h3 className="text-xl font-semibold text-green-900 mb-3">Enter Verification Code</h3>
                            <p className="text-sm text-gray-600">
                                Verification Code: {generatedCode} (Generated at {timestamp})
                            </p>
                            <p className="text-red-500 font-bold">{timeLeft} seconds remaining</p>
                            <input
                                type="text"
                                placeholder="Enter Code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full p-2 border border-gray-400 rounded-md"
                            />
                        </div>
                    )}

                    {show2FA && (
                        <button onClick={handleLogin} className="w-full py-3 bg-green-900 text-white text-lg rounded-lg font-semibold hover:bg-green-600 transition mt-4">
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>


    );
};

export default PuzzleAuth;
