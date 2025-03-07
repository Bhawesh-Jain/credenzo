import { z } from "zod";

/**
 * Common Indian validation patterns:
 * - Phone: Valid Indian mobile numbers
 * - PAN: Permanent Account Number format
 * - Pincode: 6-digit postal code
 * - Email: Standard email format
 * - Aadhaar: 12-digit unique identity number
 * - GSTIN: Goods and Services Tax Identification Number
 * - ifsc: Indian Bank Ifsc Code
 * - addressDef: 5-Character Address String
 */
export const zodPatterns = {
  phone: {
    regex: /^[6-9]\d{9}$/,
    message: "Please enter a valid Indian mobile number",
    schema: () => z.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(12, "Phone number cannot exceed 12 digits")
      .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number")
  },
  pan: {
    regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Invalid PAN Card format",
    schema: () => z.string()
      .length(10, "PAN Card number must be 10 characters")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Card format")
      .transform(s => s.toUpperCase())
  },
  pincode: {
    regex: /^\d{6}$/,
    message: "Must be 6 digits",
    schema: () => z.string().length(6, "Must be 6 digits")
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
    schema: () => z.string().email("Please enter a valid email address")
  },
  aadhaar: {
    regex: /^\d{12}$/,
    message: "Must be 12-digit Aadhaar number",
    schema: () => z.string().length(12, "Must be 12 digits")
  },
  gstin: {
    regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    message: "Invalid GSTIN format",
    schema: () => z.string().length(15, "Must be 15 characters")
  },
  ifsc: {
    regex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: "Invalid IFSC code format",
    schema: () => z.string().length(11, "Must be 11 characters")
  },
  addressDef: {
    schema: () => z.string().min(5, "Address must be at least 5 characters")
  }
} as const;