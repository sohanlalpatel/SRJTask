const Contact = require("../models/Contact");
const transporter = require("../config/email");
 


const sendEmails = (name, email, phone, service, message) => {

    // 👉 ADMIN EMAIL
    transporter.sendMail({
        from: `"SRJ Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "📩 New Contact Query",
        html: `<h3>New Message from ${name}</h3>
               <p><b>Email:</b> ${email}</p>
               <p><b>Phone:</b> ${phone}</p>
               <p><b>Service:</b> ${service}</p>
               <p><b>Message:</b> ${message}</p>`,
    })
        .then(() => console.log("✅ Admin email sent"))
        .catch(err => console.error("❌ Admin Email Error:", err));

    // 👉 USER EMAIL
    transporter.sendMail({
        from: `"SRJ Global" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "✅ We received your message",
        html: `<h2>Thank you ${name}</h2>
               <p>We will contact you soon.</p>`,
    })
        .then(() => console.log("✅ User email sent"))
        .catch(err => console.error("❌ User Email Error:", err));
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