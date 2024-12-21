import React, { useState, useRef,forwardRef  } from 'react';
import './UploadSection.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';


const UploadSection = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('Error accessing the camera:', err);
        setErrorMessage('Unable to access the camera. Please allow camera access.');
      });
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        setImage(file);
        setIsCameraOpen(false);
        video.srcObject.getTracks().forEach((track) => track.stop());
      },
      'image/jpeg',
      1
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        setErrorMessage('Only jpg, jpeg, and png formats are allowed.');
        setImage(null);
      } else if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('File size should not exceed 100MB.');
        setImage(null);
      } else {
        setErrorMessage('');
        setImage(file);
      }
    }
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setCategories((prevCategories) =>
      checked ? [...prevCategories, value] : prevCategories.filter((category) => category !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!gender || categories.length === 0 || !image) {
      setErrorMessage('Please fill in all fields and upload/capture a valid image.');
    } else {
      setLoading(true); // Show the spinner
      const formData = new FormData();
      formData.append('gender', gender);
      formData.append('collection', categories.join(','));
      formData.append('file', image);

      const token = localStorage.getItem('access_token');
      console.log(loading)


      try {
        const response = await fetch('http://127.0.0.1:8000/get_recommended_products/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });


        if (response.ok) {
          const data = await response.json();
          console.log('Recommended products:', data);
          console.log(loading)

          setLoading(false); // Hide spinner after success
          navigate('/display', { state: { abc: data.products } });
        } else {
          const errorData = await response.json();
          console.error('Error fetching recommended products:', errorData);
          setErrorMessage('Failed to fetch recommended products.');
          setLoading(false); // Hide spinner on error
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred while fetching recommended products.');
        setLoading(false); // Hide spinner on error
      }
    }
  };

  return (
    <div ref={ref} className="upload-page">
      <h2>Upload Your Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="dropdowns">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="dropdown"
          >
            <option value="" disabled>Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        <div className="checkbox-section">
          <p>Select Categories:</p>
          <label>
            <input
              type="checkbox"
              value="shirt"
              onChange={handleCategoryChange}
            />
            Shirt
          </label>
          <label>
            <input
              type="checkbox"
              value="pant"
              onChange={handleCategoryChange}
            />
            Pant
          </label>
          <label>
            <input
              type="checkbox"
              value="Kurta"
              onChange={handleCategoryChange}
            />
            Kurta
          </label>
        </div>

        {!isCameraOpen ? (
          <div className="upload-options">
            <button type="button" className="camera-btn" onClick={openCamera}>
              📷 Open Camera
            </button>
            <div className="or-divider">or</div>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="file-upload"
              onChange={handleFileUpload}
            />
            {image && <p>Photo uploaded successfully!</p>}
          </div>
        ) : (
          <div className="camera-section">
            <video ref={videoRef} className="video-preview"></video>
            <button type="button" className="capture-btn" onClick={capturePhoto}>
              Capture Photo
            </button>
          </div>
        )}

        {errorMessage && <p className="error">{errorMessage}</p>}

        {loading && <ClipLoader color="#3498db" loading={loading} size={50} />}
        <button type="submit" className="submit-btn" disabled={loading}>Submit</button>
      </form>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
});

export default UploadSection;
