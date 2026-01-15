// Import necessary modules and components
"use client";
import { CldUploadWidget } from "next-cloudinary"; // Cloudinary upload widget for Next.js
import Image from "next/image"; // Next.js Image component
import React, { useCallback } from "react"; // React and useCallback hook
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Material-UI icon for cloud upload
import { Box, Typography } from "@mui/material";

// Declare global variable 'cloudinary' (for type declaration)
declare global {
  var cloudinary: any;
}

// Props interface for ImageUpload component
interface ImageUploadProps {
  value: string; // Current value of the uploaded image URL
  setValue: any; // Callback function to update the image URL in the parent component
}

// ImageUpload component
const ImageUpload: React.FC<ImageUploadProps> = ({ value, setValue }) => {
  // Callback function to handle image upload
  const handleUpload = useCallback(
    (result: any) => {
      setValue("image", result.info.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  // Render the Cloudinary upload widget with options
  return (
    <CldUploadWidget
      onUpload={handleUpload} // Callback function to handle image upload
      uploadPreset={"gym_management_system"} // Cloudinary upload preset to be used
      options={{
        maxFiles: 1, // Maximum number of files allowed to be uploaded (1 in this case)
      }}
    >
      {({ open }) => {
        return (
          // Div container for the image upload area
          <Box
            style={{
              position: "relative",
              cursor: "pointer",
              transition: "opacity 0.2s ease-in-out",
              border: "dashed",
              borderWidth: 2,
              borderColor: "rgba(212, 212, 212, 1)",
              padding: value ? "100px" : "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              color: "rgba(82, 82, 82, 1)",
              userSelect: "none",
            }}
            onClick={() => open && open?.()} // Trigger the Cloudinary widget when clicked
          >
            {/* Cloud upload icon */}
            <CloudUploadIcon />
            {/* Text to prompt user to click and upload */}
            <Typography variant="body1">Click to upload</Typography>
            {/* Render the uploaded image */}
            {value && (
              <Box
                component="div"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: 0,
                }}
              >
                <Image
                  src={value}
                  alt={"Upload"}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
