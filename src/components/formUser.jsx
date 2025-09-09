import { set, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FormUser({ userId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const API_URL = "http://localhost:3000/api"; // Replace with your API URL

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/${userId}`);
          if (response.status === 200) {
            reset(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [userId, reset]);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    setLoading(true);
    try {
      const response = !userId
        ? await axios.post(`${API_URL}/users/createUser`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        : await axios.put(`${API_URL}/users/updateUser/${userId}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      if (response.status === 200 || response.status === 201) {
        alert(
          !userId ? `User created successfully!` : "User updated successfully!"
        );
        console.log("Response:", response.data);
        reset();
      } else {
        alert(!userId ? "Failed to create user." : "Failed to update user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        // Server ตอบกลับมาแต่มี error
        alert(
          `Error: ${
            error.response.data.message || !userId
              ? "Failed to create user"
              : "Failed to update user"
          }`
        );
      } else if (error.request) {
        // ไม่ได้รับ response จาก server
        alert("No response from server. Please check your connection.");
      } else {
        // Error อื่นๆ
        alert(
          !userId
            ? "Failed to create user. Please try again."
            : "Failed to update user. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-6 max-w-md mx-auto"
      >
        <div>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded bg-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded bg-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {!userId ? (
          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Password must contain only letters and numbers",
                },
              })}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded bg-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </>
  );
}
