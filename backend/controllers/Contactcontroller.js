const Contact = require("../models/Contact");
const transporter = require("../config/email");
const resend = require("../config/resend");


const sendEmails = async (name, email, phone, service, message) => {
    try {
        // 👉 ADMIN EMAIL
        await resend.emails.send({
            from: "SRJ Website <onboarding@resend.dev>",
            to: process.env.EMAIL_USER,
            subject: "📩 New Contact Query",
            html: `
            <div style="font-family: Arial; padding:20px;">
                <h2 style="color:#4CAF50;">New Contact Request 🚀</h2>
                
                <table style="border-collapse: collapse; width:100%;">
                    <tr>
                        <td><b>Name:</b></td>
                        <td>${name}</td>
                    </tr>
                    <tr>
                        <td><b>Email:</b></td>
                        <td>${email}</td>
                    </tr>
                    <tr>
                        <td><b>Phone:</b></td>
                        <td>${phone}</td>
                    </tr>
                    <tr>
                        <td><b>Service:</b></td>
                        <td>${service}</td>
                    </tr>
                </table>

                <div style="margin-top:20px;">
                    <b>Message:</b>
                    <p style="background:#f5f5f5; padding:10px; border-radius:8px;">
                        ${message}
                    </p>
                </div>
            </div>
            `,
        });

        console.log("✅ Admin email sent");

        // 👉 USER EMAIL
        await resend.emails.send({
            from: "SRJ Global <onboarding@resend.dev>",
            to: email,
            subject: "✅ Thanks for contacting SRJ",
            html: `
            <div style="font-family: Arial; padding:20px;">
                <h2 style="color:#4CAF50;">Hello ${name} 👋</h2>
                
                <p>Thank you for reaching out to <b>SRJ Global Technology</b>.</p>
                
                <p>We have received your request regarding <b>${service}</b>.</p>

                <div style="background:#f5f5f5; padding:15px; border-radius:8px;">
                    <p><b>Your Message:</b></p>
                    <p>${message}</p>
                </div>

                <p style="margin-top:20px;">
                    Our team will contact you shortly 🚀
                </p>

                <hr/>

                <p style="font-size:12px; color:gray;">
                    This is an automated email. Please do not reply.
                </p>
            </div>
            `,
        });

        console.log("✅ User email sent");

    } catch (err) {
        console.error("❌ Resend Error FULL:", err);
    }
};



const createContact = async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !phone || !service || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // ✅ Save to DB
        const newContact = await Contact.create({
            name,
            email,
            service,
            phone,
            message,
        });

        // ✅ 🔥 RESPONSE FIRST
        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            data: newContact,
        });

        // ================================
        // 📧 EMAIL BACKGROUND FUNCTION
        // ================================
        sendEmails(name, email, phone, service, message);

    } catch (error) {
        console.error("❌ ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// const createContact = async (req, res) => {
//     try {
//         const { name, email, phone, service, message } = req.body;

//         if (!name || !email || !phone || !service || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }

//         // ✅ Save to DB
//         const newContact = new Contact({ name, email, service, phone, message });
//         await newContact.save();

//         // ✅ 🔥 RESPONSE FIRST (IMPORTANT)
//         res.status(201).json({
//             success: true,
//             message: "Message submitted successfully",
//             data: newContact,
//         });

//         // ================================
//         // 📧 EMAILS (BACKGROUND TASK)
//         // ================================

//         // 👉 ADMIN EMAIL
//         transporter.sendMail({
//             from: `"SRJ Website" <${process.env.EMAIL_USER}>`,
//             to: process.env.EMAIL_USER,
//             subject: "📩 New Contact Query",
//             html: `<h3>New Message from ${name}</h3>
//              <p><b>Email:</b> ${email}</p>
//              <p><b>Phone:</b> ${phone}</p>
//              <p><b>Service:</b> ${service}</p>
//              <p><b>Message:</b> ${message}</p>`,
//         })
//             .then(() => console.log("✅ Admin email sent"))
//             .catch(err => console.error("❌ Admin Email Error:", err));

//         // 👉 USER EMAIL
//         transporter.sendMail({
//             from: `"SRJ Global" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "✅ We received your message",
//             html: `<h2>Thank you ${name}</h2>
//              <p>We will contact you soon.</p>`,
//         })
//             .then(() => console.log("✅ User email sent"))
//             .catch(err => console.error("❌ User Email Error:", err));

//     } catch (error) {
//         console.error("❌ ERROR:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//         });
//     }
// };


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