import React from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import "./Sell.css";

function Sell() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "olx_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dha3cwcvk/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const onSubmit = async (data) => {
    try {
      const file = data.image[0];

      if (!file) return alert("Please select an image");
      if (!file.type.startsWith("image/"))
        return alert("Only image files allowed");

      const imageUrl = await uploadImage(file);

      await addDoc(collection(db, "products"), {
        title: data.title,
        price: Number(data.price),
        description: data.description,
        category: data.category,
        imageUrl,
        sold: false,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
      });

      alert("Product Added Successfully ✅");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="sell-container">
      <div className="sell-card">
        <h2>Post Your Ad</h2>

        <form className="sell-form" onSubmit={handleSubmit(onSubmit)}>
          <label>Title</label>
          <input
            placeholder="Enter product title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}

          <label>Price</label>
          <input
            placeholder="Enter price"
            {...register("price", {
              required: "Price is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Only numbers allowed",
              },
            })}
          />
          {errors.price && <p className="error">{errors.price.message}</p>}

          <label>Description</label>
          <textarea
            placeholder="Describe your product"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}

          {/* ✅ CATEGORY DROPDOWN */}
          <label>Category</label>
          <select
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            <option value="Cars">Cars</option>
            <option value="Bikes">Bikes</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Fashion">Fashion</option>
          </select>
          {errors.category && <p className="error">Category is required</p>}

          {/* 📸 IMAGE */}
          <label>Upload Image</label>
          <input
            type="file"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && <p className="error">Image is required</p>}

          <button type="submit">Post Ad</button>
        </form>
      </div>
    </div>
  );
}

export default Sell;