import { useState } from "react";

const FormApi = ({ onFormSubmit }) => {
    const [photo, setPhoto] = useState([]);
    const [height, setHeight] = useState("");
    const [gender, setGender] = useState("");
  
  
    const onChangePhoto = (e) => {
      setPhoto(e.target.files[0]);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("size", height);
        formdata.append("session_id", "e285a6fc0232de3067a65c8152b7b73a");
        formdata.append("gender", gender);
        
        const response = await fetch("/static/avatar", {
          method: "POST",
          body: formdata,
        });
  
        if (response.ok) {
          response.text().then(function (text) {
            console.log("GLB file ->", text);
            onFormSubmit(text);
           
          });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
      
    };
  
    return (
      <div className="api-form">
        <form onSubmit={handleSubmit} className="formulario">
          <label>
            Height:
            <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          </label>
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select...</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </label>
          <label>
            Photo URL:
            <input type="file" placeholder="Chooseeee" onChange={(e) => onChangePhoto(e)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  };
  export default FormApi;