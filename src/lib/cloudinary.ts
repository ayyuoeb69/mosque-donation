import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: File, folder: string = 'mosque-donation'): Promise<string> => {
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: 'auto', // Automatically detect file type
      transformation: [
        { quality: 'auto' }, // Optimize quality
        { fetch_format: 'auto' } // Optimize format
      ]
    })
    
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file')
  }
}

export default cloudinary