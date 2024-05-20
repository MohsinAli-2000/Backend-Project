import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;

  // Check if any required field is missing
  if ([email, username, fullname, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const userAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userAlreadyExist) {
    throw new ApiError(409, "User with this email or username already exists.");
  }

  // Get file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverimageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimageLocalPath = req.files.coverimage[0].path; // Fixed path assignment
  }

  // Check if avatar is provided
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverimage = coverimageLocalPath
    ? await uploadOnCloudinary(coverimageLocalPath)
    : null;

  // Check if avatar upload was successful
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  // Create new user
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Select fields to return (excluding sensitive information)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
