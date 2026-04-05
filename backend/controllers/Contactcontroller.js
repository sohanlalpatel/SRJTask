const Contact = require("../models/Contact");
const transporter = require("../config/email");
 
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // ✅ Save to DB
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        // ✅ Email to ADMIN
        await transporter.sendMail({
            from: `"SRJ Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "📩 New Contact Query",
            html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">
  
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

    <!-- HEADER -->
    <div style="background: linear-gradient(90deg,#2563EB,#7C3AED); padding:20px; text-align:center;">
      <h2 style="color:#ffffff; margin:0;">🚀 SRJ Global</h2>
      <p style="color:#e0e7ff; margin:5px 0 0;">New Contact Inquiry</p>
    </div>

    <!-- BODY -->
    <div style="padding:25px;">
      
      <h3 style="margin-bottom:20px; color:#111827;">📩 New Message Received</h3>

      <table style="width:100%; border-collapse:collapse;">
        
        <tr>
          <td style="padding:10px; font-weight:bold; color:#374151;">Name:</td>
          <td style="padding:10px; color:#111827;">${name}</td>
        </tr>

        <tr style="background:#f9fafb;">
          <td style="padding:10px; font-weight:bold; color:#374151;">Email:</td>
          <td style="padding:10px;">
            <a href="mailto:${email}" style="color:#2563EB; text-decoration:none;">
              ${email}
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:10px; font-weight:bold; color:#374151;">Phone:</td>
          <td style="padding:10px;">${phone}</td>
        </tr>

        <tr style="background:#f9fafb;">
          <td style="padding:10px; font-weight:bold; color:#374151;">Message:</td>
          <td style="padding:10px;">${message}</td>
        </tr>

      </table>

      <!-- CTA BUTTON -->
      <div style="text-align:center; margin-top:25px;">
        <a href="mailto:${email}" 
           style="background:#2563EB; color:white; padding:12px 20px; border-radius:6px; text-decoration:none; display:inline-block;">
          Reply to Client
        </a>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background:#020617; padding:15px; text-align:center;">
      <p style="color:#9CA3AF; font-size:12px; margin:0;">
        SRJ Global • Web | App | AI Solutions
      </p>
    </div>

  </div>

</div>
`
        });

        // ✅ Confirmation Email to USER
        await transporter.sendMail({
            from: `"SRJ Global" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "✅ We received your message",
            html: `
<div style="font-family: Arial; background:#f4f6f9; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center;">

    <h2 style="color:#2563EB;">Thank You, ${name} 👋</h2>

    <p style="color:#374151;">
      We have received your message. Our team will contact you shortly.
    </p>

    <div style="margin:20px 0; padding:15px; background:#f9fafb; border-radius:8px;">
      <p style="margin:0;"><b>Your Message:</b></p>
      <p style="margin-top:10px;">${message}</p>
    </div>

    <a href="https://www.srjglobalsoftech.com/pricing"
       style="background:#7C3AED; color:white; padding:10px 18px; border-radius:6px; text-decoration:none;">
       Visit Website
    </a>

  </div>
</div>
`
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully & email delivered",
            data: newContact,
        });

    } catch (error) {
        console.error("Email Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// GET ALL
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// GET SINGLE
const getSingleContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Not found",
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// UPDATE
const updateContactStatus = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// DELETE
const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getSingleContact,
    updateContactStatus,
    deleteContact,
};