import transporter from '../config/transporter.config.js';

const forgotPass = async (req, res) => {
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const mailOptions = {
      from: "shivangbhaiisgreat@gmail.com",
      to: email,
      subject: "Evo Vault Password Reset",
      text: `Hello \n\nPlease click on the link below to reset your password:\n\n ${process.env.CLIENT_URL}/${email} \n\nIf you did not request this, please ignore this email.\n\nBest regards,\nEvo Vault`,
    };

    try {
      const sendingMail = await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: "Email sent successfully!",
        data: sendingMail,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while sending the email.",
      });
    }
}

export { forgotPass }